import * as Lab       from "lab";
import { expect }     from "code";
import { JSDOM }      from "jsdom";
import { FhirClient } from "..";
import Client         from "../src/Client";

const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;
export { lab };

interface ExtendedGlobal extends NodeJS.Global {
    document: Document;
    window: Window;
    sessionStorage: any;
    location: Location;
    btoa: (str: string) => string;
}

describe("Client", () => {

    beforeEach(() => {
        const dom = new JSDOM(``, { url: "http://localhost/a/b/c" });
        (global as ExtendedGlobal).window = dom.window;
    });

    afterEach(() => {
        delete (global as ExtendedGlobal).window;
    });

    it ("Requires state to be passed to the constructor", () => {
        expect(() => new Client(undefined)).to.throw(Error, "No state provided to the client");
    });

    it ("patient", null);
    it ("user", null);
    it ("encounter", null);

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

    it ("fhir.js api", null);
    it ("fhir.js patient.api", null);

});
