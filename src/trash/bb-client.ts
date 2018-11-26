import { decode } from "jsonwebtoken";
import Adapter    from "./adapter";
import FhirClient from "./client";
import Guid       from "./guid";
import {
  urlParam,
  stripTrailingSlash,
  relative
} from "./utils";
import { FhirClient as NS } from "../..";

export const oAuth2: NS.OAuth2 = {
    settings: {
        replaceBrowserHistory    : true,
        fullSessionStorageSupport: true
    }
};

function fetchConformanceStatement(fhirServiceUrl) {
    return Adapter.get().http({
        method: "GET",
        url: stripTrailingSlash(fhirServiceUrl) + "/metadata"
    }).then(
        metadata => metadata,
        error => Promise.reject(new Error(
            `Unable to fetch conformance statement (${error})`
        ))
    );
}

/**
 * Get the previous token stored in sessionStorage
 * based on fullSessionStorageSupport flag.
 * @return object JSON tokenResponse
 */
function getPreviousToken() {
    if (oAuth2.settings.fullSessionStorageSupport) {
        return JSON.parse(sessionStorage.tokenResponse);
    }
    const state = urlParam("state");
    return JSON.parse(sessionStorage[state]).tokenResponse;
}

function assertType(variable, type, message = null) {
    if (typeof variable !== type) {
        const msg = message || `Expected variable to be of type "${type
          }" but its type was "${typeof variable}".`;
        throw new Error(msg);
    }
}

function readyArgs(...args: NS.readyFnArgs) {
    const out: NS.readyArgsResult = {
        input: null,
        callback: (client: any) => void 0,
        errback: (error: Error | string) => void 0
    };
    const length = arguments.length;

    // 0 arguments
    if (!length) {
        throw new Error("Can't call 'ready' without arguments");
    }

    // 1 arguments
    if (length === 1 ) {
        assertType(args[0], "function", "ready called with invalid argument");
        out.callback = args[0] as NS.readyCallback;
    }

    // 2 arguments
    else if (length == 2) {
        assertType(args[1], "function", "ready called with invalid arguments");
        if (typeof args[0] == "function") {
            out.callback = args[0];
            out.errback  = args[1];
        }
        else if (typeof args[0] == "object") {
            out.input    = args[0];
            out.callback = args[1];
        }
        else {
            throw new Error("ready called with invalid arguments");
        }
    }

    // 3 arguments
    else if (length === 3) {
        assertType(args[0], "object"  , "ready called with invalid arguments");
        assertType(args[1], "function", "ready called with invalid arguments");
        assertType(args[2], "function", "ready called with invalid arguments");
        out.input    = args[0] as NS.readyInput;
        out.callback = args[1] as NS.readyCallback;
        out.errback  = args[2] as NS.readyErrorback;
    }
    else {
        throw new Error("ready called with invalid arguments");
    }

    return out;
}


class OAuth2
{
    public settings: NS.OAuth2Config;

    public debug: boolean = true;

    public constructor(options: NS.OAuth2Config = {})
    {
        this.settings = {
            replaceBrowserHistory: true,
            fullSessionStorageSupport: true,
            ...options
        };
    }

    public resolveAuthType(fhirServiceUrl, callback, errback) {
        fetchConformanceStatement(fhirServiceUrl).then(r => {
            let type = "none";

            try {
                if (r.rest[0].security.service[0].coding[0].code.toLowerCase() === "smart-on-fhir") {
                    type = "oauth2";
                }
            }
            catch (err) {
                // ignore
            }

            if (callback) {
                callback(type);
            }
        }, error => {
            if (errback) {
                errback(error);
            }
        });
    }

    public static authorize(params, errback) {

        if (!errback){
            errback = () => {
                console.log("Failed to discover authorization URL given", params);
            };
        }

        // prevent inheritance of tokenResponse from parent window
        delete sessionStorage.tokenResponse;

        if (!params.client) {
            params = {
                client: params
            };
        }

        if (!params.response_type) {
            params.response_type = "code";
        }

        if (!params.client.redirect_uri) {
            params.client.redirect_uri = relative("");
        }

        if (!params.client.redirect_uri.match(/:\/\//)) {
            params.client.redirect_uri = relative(params.client.redirect_uri);
        }

        const launch = urlParam("launch");
        if (launch){
            if (!params.client.scope.match(/launch/)) {
                params.client.scope += " launch";
            }
            params.client.launch = launch;
        }

        const server = urlParam("iss") || urlParam("fhirServiceUrl");
        if (server){
            if (!params.server){
                params.server = server;
            }
        }

        if (urlParam("patientId")){
            params.fake_token_response = params.fake_token_response || {};
            params.fake_token_response.patient = urlParam("patientId");
        }

        providers(params.server, params.provider, provider => {

            params.provider = provider;

            const state = params.client.state || Guid.newGuid();
            const client = params.client;

            if (params.provider.oauth2 == null) {

                // Adding state to tokenResponse object
                if (BBClient.settings.fullSessionStorageSupport) {
                    sessionStorage[state] = JSON.stringify(params);
                    sessionStorage.tokenResponse = JSON.stringify({ state });
                } else {
                    const combinedObject = $.extend(true, params, { "tokenResponse" : { state } });
                    sessionStorage[state] = JSON.stringify(combinedObject);
                }

                window.location.href = client.redirect_uri + "?state=" + encodeURIComponent(state);
                return;
            }

            sessionStorage[state] = JSON.stringify(params);

            console.log("sending client reg", params.client);

            let redirectTo = params.provider.oauth2.authorize_uri + "?" + [
                "client_id="     + encodeURIComponent(client.client_id),
                "response_type=" + encodeURIComponent(params.response_type),
                "scope="         + encodeURIComponent(client.scope),
                "redirect_uri="  + encodeURIComponent(client.redirect_uri),
                "state="         + encodeURIComponent(state),
                "aud="           + encodeURIComponent(params.server)
            ].join("&");

            if (typeof client.launch !== "undefined" && client.launch) {
                redirectTo += "&launch=" + encodeURIComponent(client.launch);
            }

            window.location.href = redirectTo;
        }, errback);
    }

    public static ready(..._args: NS.readyFnArgs) {

        const args = readyArgs(..._args);

        // decide between token flow (implicit grant) and code flow (authorization code grant)
        const isCode = urlParam("code") || (args.input && args.input.code);

        let accessTokenResolver = null;

        if (isFakeOAuthToken()) {
            accessTokenResolver = completePageReload();

            // In order to remove the state query parameter in the URL, both
            // replaceBrowserHistory and fullSessionStorageSupport setting flags
            // must be set to true. This allows querying the state through
            // sessionStorage. If the browser does not support the replaceState
            // method for the History Web API, or if either of the setting flags
            // are false, the state property will be retrieved from the state
            // query parameter in the URL.
            if (window.history.replaceState
                && BBClient.settings.replaceBrowserHistory
                && BBClient.settings.fullSessionStorageSupport){
                window.history.replaceState({}, "", window.location.toString().replace(window.location.search, ""));
            }
        } else {
            if (validTokenResponse()) { // we're reloading after successful completion
                // Check if 2 minutes from access token expiration timestamp
                const tokenResponse = getPreviousToken();
                const payloadCheck = decode(tokenResponse.access_token);
                const nearExpTime = Math.floor(Date.now() / 1000) >= (payloadCheck["exp"] - 120);

                if (tokenResponse.refresh_token
                && tokenResponse.scope.indexOf("online_access") > -1
                && nearExpTime) { // refresh token flow
                    accessTokenResolver = completeTokenRefreshFlow();
                } else { // existing access token flow
                    accessTokenResolver = completePageReload();
                }
            } else if (isCode) { // code flow
                accessTokenResolver = completeCodeFlow(args.input);
            } else { // token flow
                accessTokenResolver = completeTokenFlow(args.input);
            }
        }
        accessTokenResolver.done(tokenResponse => {

            if (!tokenResponse || !tokenResponse.state) {
                return args.errback("No 'state' parameter found in authorization response.");
            }

            // Save the tokenResponse object into sessionStorage
            if (BBClient.settings.fullSessionStorageSupport) {
                sessionStorage.tokenResponse = JSON.stringify(tokenResponse);
            } else {
                // Save the tokenResponse object and the state into sessionStorage keyed by state
                const combinedObject = $.extend(true, JSON.parse(sessionStorage[tokenResponse.state]), { 'tokenResponse' : tokenResponse });
                sessionStorage[tokenResponse.state] = JSON.stringify(combinedObject);
            }

            const state = JSON.parse(sessionStorage[tokenResponse.state]);
            if (state.fake_token_response) {
                tokenResponse = state.fake_token_response;
            }

            const fhirClientParams = {
                serviceUrl: state.provider.url,
                patientId: tokenResponse.patient
            };

            if (tokenResponse.id_token) {
                const id_token = tokenResponse.id_token;
                const payload = decode(id_token);
                fhirClientParams["userId"] = payload["profile"];
            }

            if (tokenResponse.access_token !== undefined) {
                fhirClientParams.auth = {
                type : "bearer",
                token: tokenResponse.access_token
                };
            } else if (!state.fake_token_response){
                return args.errback("Failed to obtain access token.");
            }

            const ret = FhirClient(fhirClientParams);
            ret.state = JSON.parse(JSON.stringify(state));
            ret.tokenResponse = JSON.parse(JSON.stringify(tokenResponse));
            args.callback(ret);

        }).fail(ret => {
            ret ? args.errback(ret) : args.errback("Failed to obtain access token.");
        });

    }
}

////////////////////////////////////////////////////////////////////////////////


function completeTokenFlow(hash = location.hash) {
    const ret = Adapter.get().defer();

    setTimeout(() => {
        let oauthResult: any = hash.match(/#(.*)/);
        oauthResult = oauthResult ? oauthResult[1] : "";
        oauthResult = oauthResult.split(/&/);
        const authorization = {};
        for (const pair of oauthResult){
            const kv = pair.split(/=/);
            if (kv[0].length > 0 && kv[1]) {
                authorization[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
            }
        }
        ret.resolve(authorization);
    }, 0);

    return ret.promise;
}

function completeCodeFlow(params){
    if (!params){
        params = {
            code : urlParam("code"),
            state: urlParam("state")
        };
    }

    const ret = Adapter.get().defer();
    const state = JSON.parse(sessionStorage[params.state]);

    if (window.history.replaceState && BBClient.settings.replaceBrowserHistory){
        window.history.replaceState({}, "", window.location.toString().replace(window.location.search, ""));
    }

    // Using window.history.pushState to append state to the query param.
    // This will allow session data to be retrieved via the state param.
    if (window.history.pushState && !BBClient.settings.fullSessionStorageSupport) {

        let queryParam = window.location.search;
        if (window.location.search.indexOf("state") == -1) {
          // Append state query param to URI for later.
          // state query param will be used to look up
          // token response upon page reload.

          queryParam += (window.location.search ? "&" : "?");
          queryParam += "state=" + params.state;

          const url = window.location.protocol + "//" +
                      window.location.host +
                      window.location.pathname +
                      queryParam;

          window.history.pushState({}, "", url);
        }
    }

    const data = {
        code        : params.code,
        grant_type  : "authorization_code",
        redirect_uri: state.client.redirect_uri
    };

    const headers = {};

    if (state.client.secret) {
        headers["Authorization"] = "Basic " + btoa(state.client.client_id + ":" + state.client.secret);
    } else {
        data["client_id"] = state.client.client_id;
    }

    Adapter.get().http({
        method: "POST",
        url: state.provider.oauth2.token_uri,
        data,
        headers
    }).then(authz => {
        for (const i in params) {
            if (params.hasOwnProperty(i)) {
                authz[i] = params[i];
            }
        }
        ret.resolve(authz);
    }, (...args) => {
        console.log("failed to exchange code for access_token", ...args);
        ret.reject();
    });

    return ret.promise;
}

/**
 * This code is needed for the page refresh/reload workflow.
 * When the access token is nearing expiration or is expired,
 * this function will make an ajax POST call to obtain a new
 * access token using the current refresh token.
 * @return promise object
 */
function completeTokenRefreshFlow() {
    const ret           = Adapter.get().defer();
    const tokenResponse = getPreviousToken();
    const state         = JSON.parse(sessionStorage[tokenResponse.state]);
    const refresh_token = tokenResponse.refresh_token;

    Adapter.get().http({
        method: "POST",
        url   : state.provider.oauth2.token_uri,
        data: {
            grant_type: "refresh_token",
            refresh_token
        },
    }).then(authz => {
        authz = $.extend(tokenResponse, authz);
        ret.resolve(authz);
    }, (...args) => {
        console.warn(
            "Failed to exchange refresh_token for access_token",
            ...args
        );
        ret.reject(
            "Failed to exchange refresh token for access token. " +
            "Please close and re-launch the application again."
        );
    });

    return ret.promise;
}

function completePageReload(){
  var d = Adapter.get().defer();
  setTimeout(() => {
      d.resolve(getPreviousToken());
  }, 0);
  return d;
}



/**
 * Check the tokenResponse object to see if it is valid or not.
 * This is to handle the case of a refresh/reload of the page
 * after the token was already obtain.
 * @return boolean
 */
function validTokenResponse() {
    if (BBClient.settings.fullSessionStorageSupport && sessionStorage.tokenResponse) {
        return true;
    } else {
        if (!BBClient.settings.fullSessionStorageSupport) {
            const state = urlParam("state") || (args.input && args.input.state);
            return (state && sessionStorage[state] && JSON.parse(sessionStorage[state]).tokenResponse);
        }
    }
    return false;
}

function isFakeOAuthToken(){
  if (validTokenResponse()) {
    var token = getPreviousToken();
    if (token && token.state) {
      var state = JSON.parse(sessionStorage[token.state]);
      return state.fake_token_response;
    }
  }
  return false;
}

function providers(fhirServiceUrl, provider, callback, errback){

    // Shim for pre-OAuth2 launch parameters
    if (isBypassOAuth()) {
        setTimeout(() => {
            bypassOAuth(fhirServiceUrl, callback);
        }, 0);
        return;
    }

    // Skip conformance statement introspection when overriding provider setting are available
    if (provider) {
        provider.url = fhirServiceUrl;
        setTimeout(() => {
            if (callback) {
                callback(provider);
            }
        }, 0);
        return;
    }

    fetchConformanceStatement(fhirServiceUrl).then(r => {
        const res = {
            "name": "SMART on FHIR Testing Server",
            "description": "Dev server for SMART on FHIR",
            "url": fhirServiceUrl,
            "oauth2": {
                "registration_uri": null,
                "authorize_uri": null,
                "token_uri": null
            }
        };

        try {
            const smartExtension = r.rest[0].security.extension.filter(e => {
                return (e.url === "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris");
            });

            smartExtension[0].extension.forEach((arg, index, array) => {
                if (arg.url === "register") {
                    res.oauth2.registration_uri = arg.valueUri;
                } else if (arg.url === "authorize") {
                    res.oauth2.authorize_uri = arg.valueUri;
                } else if (arg.url === "token") {
                    res.oauth2.token_uri = arg.valueUri;
                }
            });
        }
        catch (err) {
            return errback && errback(err);
        }

        return callback && callback(res);
    }, errback);
}

function isBypassOAuth(){
    return (urlParam("fhirServiceUrl") && !(urlParam("iss")));
}

function bypassOAuth(fhirServiceUrl, callback) {
    if (callback) {
        callback({
            "oauth2": null,
            "url": fhirServiceUrl || urlParam("fhirServiceUrl")
        });
    }
}

