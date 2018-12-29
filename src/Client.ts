import { FhirClient as NS, fhir } from "..";
import Storage from "./Storage";
// import Adapter              from "./adapter";
// import fhir                from "fhir.js";
// import fhir                from "fhir.js/src/adapters/native";
// import makeFhir             from "fhir.js/src/fhir.js";
import { getPath, checkResponse, debug, resolve } from "./lib";

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
            try {
                const idTokenValue: IDToken = JSON.parse(atob(idToken.split(".")[1]));
                const fhirUser = idTokenValue.fhirUser || idTokenValue.profile || "";
                const tokens   = fhirUser.split("/");
                if (tokens.length > 1) {
                    const id   = tokens.pop();
                    const type = tokens.pop();
                    this.user = {
                        type,
                        id,
                        read: () => this.request(`${type}/${id}`).then(r => r.json())
                    };
                }
            } catch (error) {
                console.warn("Error parsing id_token:", error);
            }
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
        url = resolve(url, this.state.serverUrl);

        // If we are talking to protected fhir server we should have an access token
        const accessToken = getPath(this.state, "tokenResponse.access_token");
        if (accessToken) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`
            };
        }

        return fetch(url, options)
            .then(resp => {
                if (resp.status == 401 && getPath(this.state, "tokenResponse.refresh_token")) {
                    return this.refresh().then(() => this.request(url, options));
                }
                return resp;
            })
            .then(checkResponse)
            .catch(() => Promise.reject(new Error(`Could not fetch "${url}"`)));
    }

    /**
     * Use the refresh token to obtain new access token. If the refresh token is
     * expired (or this fails for any other reason) it will be deleted from the
     * state, so that we don't enter into loops trying to re-authorize.
     */
    public async refresh(): Promise<void>
    {
        const refreshToken = getPath(this.state, "tokenResponse.refresh_token");

        if (!refreshToken) {
            throw new Error("Trying to refresh but there is no refresh token");
        }

        return fetch(this.state.tokenUri, {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
            body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`
        })
        .then(checkResponse)
        .then(resp => resp.json())
        .then(json => {
            this.state.tokenResponse = {
                ...this.state.tokenResponse,
                ...json as NS.TokenResponse
            };
            // Save this change into the sessionStorage
            Storage.set(this.state);
        })
        .catch(error => {
            // debug(error);
            // debug("Deleting the expired or invalid refresh token");
            delete this.state.tokenResponse.refresh_token;
            throw error;
        });
    }
}
