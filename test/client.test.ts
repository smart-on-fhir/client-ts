import * as Lab                    from "lab";
import { expect }                  from "code";
import { FhirClient }              from "..";
import Client                      from "../src/Client";


const lab = Lab.script();
const { describe, it } = lab;
export { lab };


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

});
