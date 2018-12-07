import { FhirClient as NS, fhir } from "..";
// import Adapter              from "./adapter";
// import fhir                from "fhir.js";
// import fhir                from "fhir.js/src/adapters/native";
// import makeFhir             from "fhir.js/src/fhir.js";
import { getPath } from "./lib";

declare global {
    interface Window {
        fhir?: (options?: any) => any;
    }
}

interface FhirJsAPI {
    [key: string]: any;
}

interface Patient {
    id: string;
    read: () => Promise<fhir.Resource>;
    api?: FhirJsAPI;
}

interface Encounter {
    id: string;
    read: () => Promise<fhir.Resource>;
}

interface User {
    id: string;
    type: string; // Patient, Practitioner, RelatedPerson...
    read: () => Promise<fhir.Resource>;
}

interface IDToken {
    profile: string;
    aud: string;
    sub: string;
    iss: string;
    iat: number;
    exp: number;
    [key: string]: any;
}

function absolute(path, serverUrl) {
    if (path.match(/^(http|urn)/)) return path;
    return [
        serverUrl.replace(/\/$\s*/, ""),
        path.replace(/^\s*\//, "")
    ].join("/");
}

function checkResponse(resp: Response): Promise<Response> {
    return new Promise((resolve, reject) => {
        if (resp.status < 200 || resp.status > 399) {
            reject(resp);
        }
        resolve(resp);
    });
}

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

    /**
     * The currently selected patient (if any)
     */
    public patient: Patient | null = null;

    /**
     * The currently logged-in user (if any)
     */
    public user: User | null = null;

    /**
     * The currently selected encounter (if any and if supported by the EHR)
     */
    public encounter: Encounter | null = null;

    public api?: FhirJsAPI;

    constructor(state: NS.ClientState)
    {
        // This might happen if the state have been lost (for example the
        // sessionStorage has been cleared, size limit exceeded etc.).
        if (!state) {
            throw new Error("No state provided to the client");
        }
        this.state = state;

        // Context (patient, user, encounter)
        const patientId   = getPath(this.state, "tokenResponse.patient");
        const encounterId = getPath(this.state, "tokenResponse.encounter");
        const idToken     = getPath(this.state, "tokenResponse.id_token");

        if (patientId) {
            this.patient = {
                id: patientId,
                read: () => this.request(`Patient/${patientId}`).then(r => r.json())
            };
        }

        if (encounterId) {
            this.encounter = {
                id: encounterId,
                read: () => this.request(`Encounter/${encounterId}`).then(r => r.json())
            };
        }

        if (idToken) {
            const idTokenValue: IDToken = JSON.parse(atob(idToken.split(".")[1]));
            const type = idTokenValue.profile.split("/").shift();
            const id   = idTokenValue.profile.split("/").pop();

            this.user = {
                type,
                id,
                read() {
                    return this.request(`${type}/${id}`);
                }
            };
        }


        // Set up Fhir.js API if "fhir" is available in the global scope
        if (typeof window.fhir == "function") {
            const accessToken = getPath(this.state, "tokenResponse.access_token");
            const auth = accessToken ?
                { type: "bearer", bearer: accessToken } :
                { type: "none" };

            this.api = window.fhir({
                baseUrl: state.serverUrl,
                auth
            });

            if (this.patient) {
                this.patient.api = window.fhir({
                    baseUrl: state.serverUrl,
                    patient: patientId,
                    auth
                });
            }
        }
    }

    /**
     * Allows you to do the following:
     * 1. Use relative URLs (treat them as relative to the "serverUrl" option)
     * 2. Automatically authorize requests with your accessToken (if any)
     * 3. Automatically re-authorize using the refreshToken (if available)
     * 4. Automatically parse error operation outcomes and turn them into
     *    JavaScript Error objects with which the resulting promises are rejected
     * @param {string} url the URL to fetch
     * @param {object} options fetch options
     */
    public request(url: string, options: any = {}): Promise<Response>
    {
        url = absolute(url, this.state.serverUrl);

        // If we are talking to protected fhir server we should have an access token
        const accessToken = getPath(this.state, "tokenResponse.access_token");
        if (accessToken) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`
            };
        }

        return fetch(url, options).then(checkResponse).catch(
            () => Promise.reject(`Could not fetch "${url}"`)
        );
    }

    // public get(p)
    // {
    //     if (this.api) {
    //         const params = {
    //             type: p.resource,
    //             id: p.id || undefined
    //         };
    //         return this.api.read(params)
    //             .then(res => res.data)
    //             .catch(() => Promise.reject("Could not fetch " + p.resource + " " + p.id));
    //     }

    //     let url = p.resource;
    //     if (p.id) {
    //         url += "/" + p.id;
    //     }
    //     return this.request(url);
    // }
}
