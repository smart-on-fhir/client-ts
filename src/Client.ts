import { FhirClient as NS } from "..";
// import Adapter              from "./adapter";
// import makeFhir             from "fhir.js";
// import makeFhir             from "fhir.js/src/fhir.js";
// import { urlToAbsolute, getPath } from "./lib";

/**
 * A SMART Client instance will simplify some tasks for you. It will authorize
 * requests automatically, use refresh tokens, handle errors and so on.
 */
export default class Client
{
    /**
     * The serialized state as it is stored in the session (or other storage).
     * Contains things like tokens, client secrets, settings and so on.
     */
    protected state: NS.ClientState;

    // protected fhirJs: any;

    constructor(state: NS.ClientState)
    {
        // This might happen if the state have been lost (for example the
        // sessionStorage has been cleared, size limit exceeded etc.).
        if (!state) {
            throw new Error("No state provided to the client");
        }
        this.state = state;

        // const accessToken = getPath(this.state, "tokenResponse.access_token");

        // this.fhirJs = makeFhir({
        //     baseUrl: state.serverUrl,
        //     auth: accessToken ?
        //         { bearer: accessToken } :
        //         {}
        // });
    }

    /**
     * Allows you to do the following:
     * 1. Use relative URLs (treat them as relative to the "serverUrl" option)
     * 2. Automatically authorize requests with your accessToken (if any)
     * 3. Automatically re-authorize using the refreshToken (if available)
     * 4. Automatically parse error operation outcomes and turn them into
     *   JavaScript Error objects with which the resulting promises are rejected
     * @param {string} url the URL to fetch
     * @param {object} options fetch options
     */
    public request(url: string, options: any = {})
    {
        url = this.state.serverUrl.replace(/\/?$/, "/") + url.replace(/^\//, "");
        // cfg.url = urlToAbsolute(cfg.url, location);

    //     // If we are talking to protected fhir server we should have an access token
    //     const accessToken = getPath(this.state, "tokenResponse.access_token");
    //     if (accessToken) {
    //         cfg.headers = {
    //             ...cfg.headers,
    //             Authorization: `Bearer ${accessToken}`
    //         };
    //     }

        return fetch(url, options);
    }

    // public get(p) {}

    // public getBinary(url) {}

    // public fetchBinary(path) {}

    // public authenticated(p) {}
}
