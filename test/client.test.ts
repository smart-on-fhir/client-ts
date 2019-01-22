import * as Lab       from "lab";
import { expect }     from "code";
import { JSDOM }      from "jsdom";
import * as request   from "request";
import { FhirClient } from "..";
import Client         from "../src/Client";
import * as oauth     from "../src/oauth";

const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;
export { lab };

interface ExtendedGlobal extends NodeJS.Global {
    document: Document;
    window: Window;
    sessionStorage: any;
    location: Location;
    btoa: (str: string) => string;
    atob: (str: string) => string;
}

beforeEach(() => {
    const dom = new JSDOM(``, { url: "http://localhost/a/b/c" });
    (global as ExtendedGlobal).window = dom.window;
    (global as ExtendedGlobal).document = dom.window.document;
    (global as ExtendedGlobal).location = dom.window.location;
    (global as ExtendedGlobal).btoa = str => {
        return Buffer.from(str).toString("base64");
    };
    (global as ExtendedGlobal).atob = str => {
        return Buffer.from(str, "base64").toString("ascii");
    };
});

afterEach(() => {
    delete (global as ExtendedGlobal).atob;
    delete (global as ExtendedGlobal).btoa;
    delete (global as ExtendedGlobal).location;
    delete (global as ExtendedGlobal).document;
    delete (global as ExtendedGlobal).window;
});

async function createClient(options: any = {}) {

    const launch: any = { a: 1 };
    const scope: string[] = [];

    if (options.patient) {
        launch.b = options.patient;
    }

    if (options.user) {
        launch.e = options.user;
    }

    const dummyLocation = {
        protocol: "http://",
        host    : "localhost",
        pathname: "/",
        search  : `?launch=${btoa(JSON.stringify(launch))}`
    } as Location;

    if (options.patient) {
        scope.push("launch/patient");
    }

    if (options.encounter) {
        scope.push("launch/encounter");
    }

    if (options.refresh) {
        scope.push("offline_access");
    }

    if (options.user) {
        scope.push("openid", "profile");
    }

    await oauth.authorize({
        serverUrl       : "http://launch.smarthealthit.org/v/r3/fhir",
        clientId        : "my-client-id",
        redirectUri     : "http://localhost/a/b/",
        // clientSecret    : "mySecret",
        scope           : scope.join(" "),
        // registrationUri : "my-registrationUri",
        // authorizeUri    : "my-authorizeUri",
        // tokenUri        : "my-tokenUri"
    } as FhirClient.ClientOptions, dummyLocation);

    dummyLocation.href += "&aud_validated=1&login_success=1&login_type=provider";

    if (options.user) {
        dummyLocation.href += "&provider=" + options.user;
    }

    if (options.encounter) {
        dummyLocation.href += "&encounter=" + options.encounter;
    }

    const loc = await (new Promise((resolve, reject) => {
        request({
            uri: dummyLocation.href,
            followRedirect: false,
            followAllRedirects: false
        }, (error, resp) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(resp.headers.location);
                }
            }
        );
    }) as Promise<string>);

    const dom = new JSDOM(``, { url: loc });

    (global as ExtendedGlobal).window   = dom.window;
    (global as ExtendedGlobal).document = dom.window.document;
    (global as ExtendedGlobal).location = dom.window.location;

    const client = await oauth.completeAuth();

    return client;
}

describe("Client", () => {

    it ("Requires state to be passed to the constructor", () => {
        expect(() => new Client(undefined)).to.throw(Error, "No state provided to the client");
    });

    it ("client.request can be used with string argument", () => {
        const client = new Client({
            serverUrl: "https://r3.smarthealthit.org"
        } as FhirClient.ClientState);
        expect(client.request("metadata")).not.to.reject();
    });

    it ("client.request can be used with relative paths", () => {
        const client = new Client({
            serverUrl: "https://r3.smarthealthit.org"
        } as FhirClient.ClientState);
        expect(client.request("/metadata", { method: "GET" })).not.to.reject();
    });

    it ("client.request reports errors", async () => {
        const client = new Client({
            serverUrl: "https://r3.smarthealthit.org"
        } as FhirClient.ClientState);
        expect(client.request("/x")).to.reject(Error, `Could not fetch "https://r3.smarthealthit.org/x"`);
    });

    it ("client.patient", async () => {
        const patientID = "fdb4e56a-145b-4962-8a54-e056757832aa";
        const userID = "smart-Practitioner-7880378";
        const client = await createClient({ patient: patientID, user: userID });
        expect(client.patient).to.be.an.object();
        expect(client.patient.id).to.equal(patientID);
        expect(client.patient.read).to.be.function();
        const patient = await(client.patient.read());
        expect(patient.id).to.equal(patientID);
    });

    it ("client.encounter", async () => {
        const patientID = "fdb4e56a-145b-4962-8a54-e056757832aa";
        const encounterID = "3cc0eac7-cd0c-4556-af8c-d1c8f4f02f50";
        const userID = "smart-Practitioner-7880378";
        const client = await createClient({ patient: patientID, encounter: encounterID, user: userID });
        expect(client.encounter).to.be.an.object();
        expect(client.encounter.id).to.equal(encounterID);
        expect(client.encounter.read).to.be.function();
        const encounter = await(client.encounter.read());
        expect(encounter.id).to.equal(encounterID);
    });

    it ("client.user", async () => {
        const patientID = "fdb4e56a-145b-4962-8a54-e056757832aa";
        const userID = "smart-Practitioner-7880378";
        const client = await createClient({ patient: patientID, user: userID });
        expect(client.user).to.be.an.object();
        expect(client.user.id).to.equal(userID);
        expect(client.user.type).to.equal("Practitioner");
        expect(client.user.read).to.be.function();
        const user = await(client.user.read());
        expect(user.id).to.equal(userID);
    });

    it ("client.request fails after the access token expires and no refresh tokens is used", async () => {
        const client = await createClient();
        await client.request("/Patient");
        client.state.tokenResponse.access_token = "xxxxxx";
        expect(client.request("/Patient")).to.reject(Error, /^Could not fetch/);
    });

    it ("client.request uses refresh tokens properly", async () => {
        const client = await createClient({ refresh: true });
        await client.request("/Patient");
        client.state.tokenResponse.access_token = "xxxxxx";
        await client.request("/Patient");
        expect(client.state.tokenResponse.access_token).to.match(/[^.]+\.[^.]+\.[^.]+$/);
    });

    it ("client.refresh rejects if no refresh token is available", async () => {
        const client = await createClient();
        expect(client.refresh()).to.reject(Error, "Trying to refresh but there is no refresh token");
    });

    it ("client.refresh deletes invalid refresh tokens", async () => {
        const client = await createClient({ refresh: true });
        client.state.tokenResponse.refresh_token = "xxxxxx";
        await expect(client.refresh()).to.reject();
        expect(client.state.tokenResponse.refresh_token).to.not.exist();
    });

    it ("works without authorization", () => {
        const client = new Client({
            serverUrl: "https://r3.smarthealthit.org"
        } as FhirClient.ClientState);
        expect(client.request("/Patient", { method: "GET" })).not.to.reject();
    });

    it ("client.patient is null by default", () => {
        const client = new Client({
            serverUrl: "https://r3.smarthealthit.org"
        } as FhirClient.ClientState);
        expect(client.patient).to.equal(null);
    });

    it ("client.patient is properly initialized", () => {
        const client = new Client({
            serverUrl: "https://r3.smarthealthit.org",
            tokenResponse: {
                patient: "test-patient-id"
            }
        } as FhirClient.ClientState);
        expect(client.patient.id).to.equal("test-patient-id");
        expect(client.patient.read).to.be.a.function();
    });

    it ("client.encounter is null by default", () => {
        const client = new Client({
            serverUrl: "https://r3.smarthealthit.org"
        } as FhirClient.ClientState);
        expect(client.encounter).to.equal(null);
    });

    it ("client.encounter is properly initialized", () => {
        const client = new Client({
            serverUrl: "https://r3.smarthealthit.org",
            tokenResponse: {
                encounter: "test-encounter-id"
            }
        } as FhirClient.ClientState);
        expect(client.encounter.id).to.equal("test-encounter-id");
        expect(client.encounter.read).to.be.a.function();
    });

    it ("client.user is null by default", () => {
        const client = new Client({
            serverUrl: "https://r3.smarthealthit.org"
        } as FhirClient.ClientState);
        expect(client.user).to.equal(null);
    });

    it ("client.user is null for bad id tokens", () => {
        const orig = console.warn;
        console.warn = () => void 0;
        const badToken1 = "header." + Buffer.from("{}").toString("base64") + ".footer";
        const client = new Client({
            serverUrl: "https://r3.smarthealthit.org",
            tokenResponse: {
                id_token: badToken1
            }
        } as FhirClient.ClientState);
        expect(client.user).to.equal(null);

        const badToken2 = "header." + Buffer.from(`{"fhirUser":"whatever"}`).toString("base64") + ".footer";
        const client2 = new Client({
            serverUrl: "https://r3.smarthealthit.org",
            tokenResponse: {
                id_token: badToken2
            }
        } as FhirClient.ClientState);
        expect(client2.user).to.equal(null);

        const client3 = new Client({
            serverUrl: "https://r3.smarthealthit.org",
            tokenResponse: {
                id_token: "header.badBody.footer"
            }
        } as FhirClient.ClientState);
        expect(client3.user).to.equal(null);
        console.warn = orig;
    });

    it ("client.user is properly initialized from short 'profile'", () => {
        const client = new Client({
            serverUrl: "https://r3.smarthealthit.org",
            tokenResponse: {
                id_token: "header." + Buffer.from(
                    `{"profile":"Practitioner/PractitionerID"}`
                ).toString("base64") + ".footer"
            }
        } as FhirClient.ClientState);
        expect(client.user.type).to.equal("Practitioner");
        expect(client.user.id).to.equal("PractitionerID");
        expect(client.user.read).to.be.a.function();
    });

    it ("client.user is properly initialized from short 'fhirUser'", () => {
        const client = new Client({
            serverUrl: "https://r3.smarthealthit.org",
            tokenResponse: {
                id_token: "header." + Buffer.from(
                    `{"fhirUser":"Patient/PatientID"}`
                ).toString("base64") + ".footer"
            }
        } as FhirClient.ClientState);
        expect(client.user.type).to.equal("Patient");
        expect(client.user.id).to.equal("PatientID");
        expect(client.user.read).to.be.a.function();
    });

    it ("client.user is properly initialized from full 'fhirUser' URL", () => {
        const client = new Client({
            serverUrl: "https://r3.smarthealthit.org",
            tokenResponse: {
                id_token: "header." + Buffer.from(
                    `{"fhirUser":"https://domain.smart/fhir/RelatedPerson/RelatedPersonID"}`
                ).toString("base64") + ".footer"
            }
        } as FhirClient.ClientState);
        expect(client.user.type).to.equal("RelatedPerson");
        expect(client.user.id).to.equal("RelatedPersonID");
        expect(client.user.read).to.be.a.function();
    });

    it ("client.getState works with no (or falsy) arguments", () => {
        const state  = { serverUrl: "whatever" };
        const client = new Client(state as FhirClient.ClientState);
        expect(client.getState()).to.equal(state);
        expect(client.getState("")).to.equal(state);
        expect(client.getState(null)).to.equal(state);
        expect(client.getState(false)).to.equal(state);
    });

    it ("client.getState works with paths", () => {
        const state  = { a: { b: "x" } };
        const client = new Client(state as FhirClient.ClientState);
        expect(client.getState("a")).to.equal({ b: "x" });
        expect(client.getState("a.b")).to.equal("x");
    });

    it ("fhir.js api without auth", () => {
        const state = { serverUrl: "https://r3.smarthealthit.org" };
        window.fhir = (options) => options;
        const client = new Client(state as FhirClient.ClientState);
        expect(client.api).to.equal({
            baseUrl: state.serverUrl,
            auth: {
                type: "none"
            }
        });
    });

    it ("fhir.js api without auth", () => {
        const state = {
            serverUrl: "https://r3.smarthealthit.org"
            tokenResponse: {
                access_token: "xxxxxxxxxx"
            }
        };
        window.fhir = (options) => options;
        const client = new Client(state as FhirClient.ClientState);
        expect(client.api).to.equal({
            baseUrl: state.serverUrl,
            auth: {
                type: "bearer",
                bearer: state.tokenResponse.access_token
            }
        });
    });

    it ("fhir.js patient.api without auth", () => {
        const state = {
            serverUrl: "https://r3.smarthealthit.org",
            tokenResponse: {
                patient: "patient-id"
            }
        };
        window.fhir = (options) => options;
        const client = new Client(state as FhirClient.ClientState);
        expect(client.api).to.equal({
            baseUrl: state.serverUrl,
            auth: {
                type: "none"
            }
        });
        expect(client.patient.api).to.equal({
            baseUrl: state.serverUrl,
            patient: state.tokenResponse.patient,
            auth: {
                type: "none"
            }
        });
    });

    it ("fhir.js patient.api with auth", () => {
        const state = {
            serverUrl: "https://r3.smarthealthit.org",
            tokenResponse: {
                access_token: "xxxxxxxxxx",
                patient: "patient-id"
            }
        };
        window.fhir = (options) => options;
        const client = new Client(state as FhirClient.ClientState);
        expect(client.api).to.equal({
            baseUrl: state.serverUrl,
            auth: {
                type: "bearer",
                bearer: state.tokenResponse.access_token
            }
        });
        expect(client.patient.api).to.equal({
            baseUrl: state.serverUrl,
            patient: state.tokenResponse.patient,
            auth: {
                type: "bearer",
                bearer: state.tokenResponse.access_token
            }
        });
    });
});
