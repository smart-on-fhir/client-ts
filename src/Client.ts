import { SMART, Client as ClientInterface } from "..";
import Storage from "./Storage";
import { getPath, fetchJSON, checkResponse, responseToJSON, resolve } from "./lib";


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
    protected state: ClientInterface.State;

    /**
     * The currently selected patient (if any)
     */
    public patient: ClientInterface.Patient | null = null;

    /**
     * The currently logged-in user (if any)
     */
    public user: ClientInterface.User | null = null;

    /**
     * The currently selected encounter (if any and if supported by the EHR)
     */
    public encounter: ClientInterface.Encounter | null = null;

    /**
     * Will refer to the global fhir.js api if fhir.js is available. It will be
     * undefined.
     */
    public api?: ClientInterface.FhirJsAPI;

    /**
     * Creates ne Client instance.
     * @param state Required state to initialize with.
     */
    public constructor(state: ClientInterface.State)
    {
        // This might happen if the state have been lost (for example the
        // sessionStorage has been cleared, size limit exceeded etc.).
        if (!state) {
            throw new Error("No state provided to the client");
        }
        this.state = state;

        // Context (patient, user, encounter)
        const patientId   = this.getState("tokenResponse.patient");
        const encounterId = this.getState("tokenResponse.encounter");
        const idToken     = this.getState("tokenResponse.id_token");

        if (patientId) {
            this.setPatientId(patientId);
        }

        if (encounterId) {
            this.setEncounter(encounterId);
        }

        if (idToken) {
            this.parseIdToken(idToken);
        }

        // Set up Fhir.js API if "fhir" is available in the global scope
        if (typeof window.fhir == "function") {
            const accessToken = this.getState("tokenResponse.access_token");
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
     * Parses the given id token, extracts the user information out of it and
     * sets the current user.
     * NOTE: To reduce the size of the script we do not use any jwt library to
     * parse the token and we do not validate signatures!
     * @param idToken The ID token to parse. This must be a jwt token.
     */
    private parseIdToken(idToken)
    {
        try {
            const token: SMART.IDToken = JSON.parse(atob(idToken.split(".")[1]));
            const fhirUser = token.fhirUser || token.profile || "";
            const tokens   = fhirUser.split("/");
            if (tokens.length > 1) {
                const id   = tokens.pop();
                const type = tokens.pop();
                this.setUser(type, id);
            }
        } catch (error) {
            console.warn("Error parsing id_token:", error);
        }
    }

    /**
     * Sets the current patient
     * @param id The ID of the patient
     */
    public setPatientId(id: string | number)
    {
        this.patient = {
            id  : String(id),
            read: () => this.request(`Patient/${id}`).then(responseToJSON)
        };
    }

    /**
     * Sets the current encounter
     * @param id The ID of the encounter
     */
    public setEncounter(id: string | number)
    {
        this.encounter = {
            id  : String(id),
            read: () => this.request(`Encounter/${id}`).then(responseToJSON)
        };
    }

    /**
     * Sets the current user
     * @param type The resource type of the user (Eg. "Patient", "Practitioner",
     * "RelatedPerson"...)
     * @param id The ID of the user
     */
    public setUser(type: string, id: string | number)
    {
        this.user = {
            type,
            id  : String(id),
            read: () => this.request(`${type}/${id}`).then(responseToJSON)
        };
    }

    /**
     * Gets the state, optionally diving into specific node by the given path
     * @param {string} The path to look up. Defaults to "".
     */
    public getState(path: string = "")
    {
        if (!path) {
            return this.state;
        }
        return getPath(this.state, path);
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
        const accessToken = this.getState("tokenResponse.access_token");
        if (accessToken) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`
            };
        }

        return fetch(url, options)
            .then(resp => {
                if (resp.status == 401 && this.getState("tokenResponse.refresh_token")) {
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

        return fetchJSON(this.state.tokenUri, {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
            body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`
        })
        .then(json => {
            this.state.tokenResponse = {
                ...this.state.tokenResponse,
                ...json as SMART.TokenResponse
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
