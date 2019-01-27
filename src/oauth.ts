import {
    FhirClient as NS,
    fhir,
    SMART,
    Client as ClientInterface
} from "..";
import Client                            from "./Client";
import Storage                           from "./Storage";
import {
    urlParam,
    getPath,
    urlToAbsolute,
    randomString,
    fetchJSON,
    debug
} from "./lib";


export function fetchConformanceStatement(baseUrl: string = "/"): Promise<fhir.CapabilityStatement> {
    const url = String(baseUrl).replace(/\/*$/, "/") + "metadata";
    return fetchJSON(url).catch((ex: Error) => {
        debug(ex);
        throw new Error(`Failed to fetch the conformance statement from "${url}". ${ex}`);
    });
}

export function fetchWellKnownJson(baseUrl: string = "/"): Promise<SMART.WellKnownSmartConfiguration> {
    const url = String(baseUrl).replace(/\/*$/, "/") + ".well-known/smart-configuration";
    return fetchJSON(url).catch((ex: Error) => {
        debug(ex);
        throw new Error(`Failed to fetch the well-known json "${url}". ${ex.message}`);
    });
}

/**
 * Given a fhir server returns an object with it's Oauth security endpoints that
 * we are interested in
 * @param baseUrl Fhir server base URL
 */
export function getSecurityExtensions(baseUrl: string = "/"): Promise<NS.OAuthSecurityExtensions> {
    return fetchWellKnownJson(baseUrl).then(
        meta => ({
            registrationUri: meta.registration_endpoint || "",
            authorizeUri   : meta.authorization_endpoint || "",
            tokenUri       : meta.token_endpoint || ""
        }),
        () => fetchConformanceStatement(baseUrl).then(metadata => {
            const nsUri = "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris";
            const extensions = (getPath(metadata || {}, "rest.0.security.extension") || [])
                .filter(e => e.url === nsUri)
                .map(o => o.extension)[0];

            const out: NS.OAuthSecurityExtensions = {
                registrationUri : "",
                authorizeUri    : "",
                tokenUri        : ""
            };

            if (extensions) {
                extensions.forEach(ext => {
                    if (ext.url === "register") {
                        out.registrationUri = ext.valueUri;
                    }
                    if (ext.url === "authorize") {
                        out.authorizeUri = ext.valueUri;
                    }
                    if (ext.url === "token") {
                        out.tokenUri = ext.valueUri;
                    }
                });
            }

            return out;
        }
    ));
}

/**
 * Calls the buildAuthorizeUrl function to construct the redirect URL and then
 * just redirects to it. Note that the returned promise will either be rejected
 * in case of error, or it will never be resolved because the page wil redirect.
 */
export function authorize(options: NS.AuthorizeOptions | NS.AuthorizeOptionSet[] = {}, loc: Location = location): Promise<any> {
    return buildAuthorizeUrl(options, loc).then(redirect => {
        try {
            loc.href = redirect;
        } catch (ex) {
            throw new Error(`Unable to redirect to ${redirect}. ${ex}`);
        }
        return redirect;
    });
}

/**
 * First discovers the fhir server base URL from query.iis or query.fhirServiceUrl
 * or options.serverUrl. Then compiles the proper authorization URL for that server.
 * For open servers that URL is the options.redirectUri so that we can skip the
 * authorization part.
 *
 * The following flows are possible:
 * 1. EHR Launch        - pass "iss" and "launch" URL params
 * 2. Standalone Launch - pass "serverUrl" as option
 * 3. Test Launch       - pass "serverUrl" as URL param (takes precedence over #2)
 */
export function buildAuthorizeUrl(options: NS.AuthorizeOptions | NS.AuthorizeOptionSet[] = {}, loc: Location = location): Promise<string> {

    const iss            = urlParam("iss"           , { location: loc }) || "";
    const fhirServiceUrl = urlParam("fhirServiceUrl", { location: loc }) || "";

    let cfg;
    let serverUrl = String(iss || fhirServiceUrl || "");
    if (Array.isArray(options)) {
        cfg = options.find(o => {
            if (typeof o.iss == "string") {
                return o.iss === iss || o.iss === fhirServiceUrl;
            }
            if (o.iss instanceof RegExp) {
                return (iss && o.iss.test(iss as string)) ||
                       (fhirServiceUrl && o.iss.test(fhirServiceUrl as string));
            }
        });

        if (!cfg) {
            return Promise.reject(new Error(`None of the provided configurations matched the current server "${serverUrl}"`));
        }
    }
    else {
        cfg = options;
        if (!serverUrl) {
            serverUrl = String(cfg.serverUrl || "");
        }
    }

    const launch = urlParam("launch", { location: loc });

    if (iss && !launch) {
        return Promise.reject(new Error(`Missing url parameter "launch"`));
    }

    if (!serverUrl) {
        return Promise.reject(new Error(
            "No server url found. It must be specified as query.iss or " +
            "query.fhirServiceUrl or options.serverUrl (in that order)"
        ));
    }

    debug(`Looking up the authorization endpoint for "${serverUrl}"`);
    return getSecurityExtensions(serverUrl).then(extensions => {

        // Prepare the object that will be stored in the session
        const state: ClientInterface.State = {
            serverUrl,
            clientId   : cfg.clientId,
            redirectUri: urlToAbsolute(cfg.redirectUri || "."),
            scope      : cfg.scope || "",
            ...extensions
        };

        if (cfg.clientSecret) {
            state.clientSecret = cfg.clientSecret;
        }

        // Create an unique key and use it to store the state
        const id = randomString(32);
        sessionStorage.setItem(id, JSON.stringify(state));

        // In addition, save the random key to a well-known location. This way
        // the page knows how to find it after reload and restore it's client
        // state from there.
        sessionStorage.setItem("smartId", id);

        let redirectUrl = state.redirectUri;
        if (state.authorizeUri) {

            if (!cfg.clientId) {
                throw new Error(
                    `A "clientId" option is required by this server`
                );
            }

            debug(`authorizeUri: ${state.authorizeUri}`);
            const params = [
                "response_type=code",
                "client_id="    + encodeURIComponent(state.clientId),
                "scope="        + encodeURIComponent(state.scope),
                "redirect_uri=" + encodeURIComponent(state.redirectUri),
                "aud="          + encodeURIComponent(state.serverUrl),
                "state="        + id
            ];

            // also pass this in case of EHR launch
            if (launch) {
                params.push("launch=" + encodeURIComponent(launch as string));
            }

            redirectUrl = state.authorizeUri + "?" + params.join("&");
        }

        return redirectUrl;
    });
}

/**
 * Builds the token request options for axios. Does not make the request, just
 * creates it's configuration and returns it in a Promise.
 * NOTE that this function has side effects because it modifies the storage
 * contents.
 * @param req
 * @param storage
 */
export function buildTokenRequest(code: string, state: ClientInterface.State): RequestInit {

    if (!state.redirectUri) {
        throw new Error(`Missing state.redirectUri`);
    }

    if (!state.tokenUri) {
        throw new Error(`Missing state.tokenUri`);
    }

    if (!state.clientId) {
        throw new Error(`Missing state.clientId`);
    }

    const requestOptions: any = {
        method: "POST",
        // url   : state.tokenUri,
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body: `code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(state.redirectUri)}`
    };

    // For public apps, authentication is not possible (and thus not required),
    // since a client with no secret cannot prove its identity when it issues a
    // call. (The end-to-end system can still be secure because the client comes
    // from a known, https protected endpoint specified and enforced by the
    // redirect uri.) For confidential apps, an Authorization header using HTTP
    // Basic authentication is required, where the username is the app’s
    // client_id and the password is the app’s client_secret (see example).
    if (state.clientSecret) {
        requestOptions.headers.Authorization = "Basic " + btoa(
            state.clientId + ":" + state.clientSecret
        );
        debug(
            `Using state.clientSecret to construct the authorization header: "${
            requestOptions.headers.Authorization}"`
        );
    } else {
        debug(`No clientSecret found in state. Adding client_id to the POST body`);
        // requestOptions.data.client_id = state.clientId;
        requestOptions.body += `&client_id=${encodeURIComponent(state.clientId)}`;
    }

    return requestOptions;
}

/**
 * After successful authorization we have received a code and state parameters.
 * Use this function to exchange that code for an access token and complete the
 * authorization flow.
 */
export function completeAuth(): Promise<Client> {
    debug("Completing the code flow");

    // These are coming from the URL so make sure we validate them
    const state = urlParam("state");
    const code  = urlParam("code");
    // if (!state) throw new Error('No "state" parameter found in the URL');
    // if (!code ) throw new Error('No "code" parameter found in the URL' );

    // Remove the `code` and `state` params from the URL so that if the page is
    // reloaded it won't have to re-authorize
    if (window.history.replaceState) {
        window.history.replaceState({}, "", location.href.replace(location.search, ""));
    }

    // We have received a `state` param that should be the sessionStorage key
    // in which we store our state. But what if somebody passes `state` param
    // manually and trick us to store the state on different location?
    if (Storage.key() !== state) {
        return Promise.reject(new Error(
            `State key mismatch. Expected "${state}" but found "${Storage.key()}".`
        ));
    }

    const cached = Storage.get();

    // state and code are coming from the page url so they might be empty or
    // just invalid. In this case buildTokenRequest() will throw!
    const requestOptions = buildTokenRequest(code as string, cached);

    // The EHR authorization server SHALL return a JSON structure that
    // includes an access token or a message indicating that the
    // authorization request has been denied.
    return fetchJSON(cached.tokenUri, requestOptions)
        .then(data => {
            debug(`Received tokenResponse. Saving it to the state...`);
            cached.tokenResponse = data;
            Storage.set(cached);
            return cached;
        })
        .then(stored => waitForDomReady(stored))
        .then(stored => new Client(stored as ClientInterface.State));
}

export function init(options?: NS.ClientOptions): Promise<Client | {}>
{
    // if `code` and `state` params are present we need to complete the auth flow
    if (urlParam("state") && urlParam("code")) {
        return completeAuth();
    }

    // Check for existing client state. If state is found, it means a client
    // instance have already been created in this session and we should try to
    // "revive" it.
    const cached = Storage.get();
    if (cached) {
        return Promise.resolve(new Client(cached));
    }

    // Otherwise try to launch
    return authorize(options).then(() => {
        // `init` promises a Client but that cannot happen in this case. The
        // browser will be redirected (unload the page and be redirected back
        // to it later and the same init function will be called again). On
        // success, authorize will resolve with the redirect url but we don't
        // want to return that from this promise chain because it is not a
        // Client instance. At the same time, if authorize fails, we do want to
        // pass the error to those waiting for a client instance.
        return new Promise(() => { /* leave it pending! */ });
    });
}

// export async function ready(): Promise<Client> {

//     // First check for existing client state
//     const cached = Storage.get();

//     // If state is found, it means a client instance have already been created
//     // in this session and we should try to revive it.
//     if (cached) {
//         return new Client(cached);
//     }

//     // If no state is found we should be visiting this page for the first time
//     const state = urlParam("state");
//     const code  = urlParam("code");

//     // if `code` and `state` params are present we need to complete the auth flow
//     if (state && code) {
//         return completeAuth();
//     }

//     throw new Error("Unable to complete authentication. Please re-launch the application");
// }


function waitForDomReady(...args) {
    return new Promise(resolve => {
        if (document.readyState == "complete") {
            resolve(...args);
        }
        else {
            setTimeout(() => waitForDomReady(...args), 100);
        }
    });
}
