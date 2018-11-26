import { FhirClient as NS } from "..";
import Adapter              from "./adapter";
// import makeFhir             from "fhir.js";
import makeFhir             from "fhir.js/src/fhir.js";
import { urlToAbsolute, getPath } from "./lib";

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

    protected fhirJs: any;

    constructor(state: NS.ClientState)
    {
        // This might happen if the state have been lost (for example the
        // sessionStorage has been cleared, size limit exceeded etc.).
        if (!state) {
            throw new Error("No state provided to the client");
        }
        this.state = state;

        const accessToken = getPath(this.state, "tokenResponse.access_token");

        this.fhirJs = makeFhir({
            baseUrl: state.serverUrl,
            auth: accessToken ?
                { bearer: accessToken } :
                {}
        });
    }

    /**
     * Allows you to do the following:
     * 1. Use relative URLs (treat them as relative to the "serverUrl" option)
     * 2. Automatically authorize requests with your accessToken (if any)
     * 3. Automatically re-authorize using the refreshToken (if available)
     * 4. Automatically parse error operation outcomes and turn them into
     *   JavaScript Error objects with which the resulting promises are rejected
     * @param {object|string} options URL or axios request options
     */
    public request(options)
    {
        let cfg;
        if (typeof options == "string") {
            cfg = { url: options };
        } else {
            cfg = { ...options };
        }

        cfg.url = this.state.serverUrl.replace(/\/?$/, "/") + cfg.url.replace(/^\//, "");
        // cfg.url = urlToAbsolute(cfg.url, location);

        // If we are talking to protected fhir server we should have an access token
        const accessToken = getPath(this.state, "tokenResponse.access_token");
        if (accessToken) {
            cfg.headers = {
                ...cfg.headers,
                Authorization: `Bearer ${accessToken}`
            };
        }

        return Adapter.get().http(cfg);
    }

    public get(p) {
        // const ret    = Adapter.get().defer();
        // const params: any = { type: p.resource };

        // if (p.id) {
        //     params.id = p.id;
        // }

        // fhirAPI.read(params).then(res => {
        //     ret.resolve(res.data);
        // }, () => {
        //     ret.reject("Could not fetch " + p.resource + " " + p.id);
        // });

        // return ret.promise;
    }

    public getBinary(url) {

        // const ret = Adapter.get().defer();

        // Adapter.get().http(this.authenticated({
        //     type: "GET",
        //     url,
        //     dataType: "blob"
        // }))
        // .done(blob => ret.resolve(blob))
        // .fail((...args) => ret.reject("Could not fetch " + url, ...args));
        // return ret.promise;
    }

    public fetchBinary(path) {
        // const url = absolute(path, this.server);
        // return this.getBinary(url);
    }

    public authenticated(p) {
        // // if (this.server.auth.type == "none") {
        // //     return p;
        // // }

        // let h;
        // if (this.server.auth.type == "basic") {
        //     h = "Basic " + btoa(this.server.auth.username + ":" + this.server.auth.password);
        // } else if (this.server.auth.type == "bearer") {
        //     h = "Bearer " + this.server.auth.token;
        // }
        // if (!p.headers) {
        //     p.headers = {};
        // }
        // p.headers.Authorization = h;

        // return p;
    }
}
