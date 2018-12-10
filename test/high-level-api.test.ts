import * as Lab             from "lab";
import { expect }           from "code";
import { JSDOM }            from "jsdom";
import { SMART, FHIR }      from "../src/index";
import { FhirClient as NS } from "..";
import { urlParam }         from "../src/lib";


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

describe ("High-level API", () => {

    beforeEach(() => {
        const _data = {};
        (global as ExtendedGlobal).sessionStorage = {
            setItem(id, value) {
                _data[id] = value;
            },
            getItem(id) {
                return _data[id];
            },
            get() {
                return { ..._data };
            }
        };

        const dom = new JSDOM(``, {
            url: "http://localhost/a/b/c",
        });

        // console.log(dom.window.SMART);

        (global as ExtendedGlobal).window   = dom.window;
        (global as ExtendedGlobal).document = dom.window.document;
        (global as ExtendedGlobal).location = dom.window.location;
        (global as ExtendedGlobal).btoa = str => {
            return Buffer.from(str).toString("base64");
        };
    });

    afterEach(() => {
        delete (global as ExtendedGlobal).sessionStorage;
        delete (global as ExtendedGlobal).document;
        delete (global as ExtendedGlobal).location;
        delete (global as ExtendedGlobal).btoa;
        delete (global as ExtendedGlobal).window;
    });

    describe ("window.SMART", () => {

        describe ("authorize", () => {

            it ("requires serverUrl option if iss and fhirServiceUrl are not passed as URL params", async () => {
                await expect(SMART.authorize()).to.reject(Error, /^No server url found/);
            });

            it ("works with query.iss", async () => {
                (global as ExtendedGlobal).location = {
                    search: "?iss=http://r3.smarthealthit.org&launch=123"
                } as Location;
                await expect(SMART.authorize({
                    clientId: "my-client-id"
                } as NS.ClientOptions)).not.to.reject();
            });

            it ("works with query.fhirServiceUrl", async () => {
                (global as ExtendedGlobal).location = {
                    search: "?fhirServiceUrl=http://r3.smarthealthit.org"
                } as Location;
                await expect(SMART.authorize({
                    clientId: "my-client-id"
                } as NS.ClientOptions)).not.to.reject();
            });

            it ("requires query.launch if query.iss is present", async () => {
                (global as ExtendedGlobal).location = {
                    search: "?iss=http://r3.smarthealthit.org"
                } as Location;
                await expect(SMART.authorize({
                    clientId: "my-client-id"
                } as NS.ClientOptions)).to.reject(Error, `Missing url parameter "launch"`);
            });

            it ("does not require clientId option for open servers", async () => {
                (global as ExtendedGlobal).location = {
                    search: "?"
                } as Location;
                await expect(SMART.authorize({
                    serverUrl: "http://r3.smarthealthit.org"
                } as NS.ClientOptions)).not.to.reject();
            });

            it ("requires clientId option for protected servers", async () => {
                await expect(SMART.authorize({
                    serverUrl: "http://launch.smarthealthit.org/v/r3/fhir"
                } as NS.ClientOptions)).to.reject(Error, /^A "clientId" option is required/);
            });

            // redirectUri: string;
            it ("the redirectUri option defaults to '.'", async () => {
                (global as ExtendedGlobal).location = { search: "?" } as Location;
                const redirect = await SMART.authorize({
                    serverUrl: "http://r3.smarthealthit.org"
                } as NS.ClientOptions);
                expect(redirect).to.equal("http://localhost/a/b/");
            });

            // scope?: string;
            it ("the scope option defaults to ''", async () => {
                (global as ExtendedGlobal).location = { search: "?" } as Location;
                const redirect = await SMART.authorize({
                    serverUrl: "http://launch.smarthealthit.org/v/r3/fhir",
                    clientId : "my-client-id"
                } as NS.ClientOptions);

                const search = "?" + redirect.split("?")[1];
                expect(urlParam("scope", { location: { search } as Location})).to.equal("");
            });

            // clientSecret?: string;
            it ("clientSecret can be passed for confidential clients", async () => {
                (global as ExtendedGlobal).location = { search: "?" } as Location;
                const redirect = await SMART.authorize({
                    serverUrl   : "http://launch.smarthealthit.org/v/r3/fhir",
                    clientId    : "my-client-id",
                    clientSecret: "mySecret"
                } as NS.ClientOptions);

                const id = sessionStorage.getItem("smartId");
                const state = JSON.parse(sessionStorage.getItem(id));
                expect(state.clientSecret).to.equal("mySecret");
            });

            describe ("multi-server", () => {

                it ("exact match when iss is a string", async () => {
                    (global as ExtendedGlobal).location = {
                        search: "?iss=http://launch.smarthealthit.org/v/r3/fhir&launch=123"
                    } as Location;
                    const redirect = await SMART.authorize([
                        {
                            iss: "http://r3.smarthealthit.org"
                        },
                        {
                            iss: "http://launch.smarthealthit.org/v/r3/fhir",
                            clientId: "whatever"
                        }
                    ]);
                    expect(redirect).to.startWith("http://launch.smarthealthit.org/");
                });

                it ("exact match when iss is a string", async () => {
                    (global as ExtendedGlobal).location = {
                        search: "?iss=http://launch.smarthealthit.org/v/r3/fhir&launch=123"
                    } as Location;
                    const redirect = await SMART.authorize([
                        {
                            iss: "http://r3.smarthealthit.org"
                        },
                        {
                            iss: /\blaunch\.smarthealthit\.org\b/,
                            clientId: "whatever"
                        }
                    ]);
                    expect(redirect).to.startWith("http://launch.smarthealthit.org/");
                });
            });
        });

        describe ("init", () => {
            it ("can authorize properly with empty sessionStorage", () => {
                //
            });
        });
    });

    describe ("window.FHIR.oAuth2", () => {
        describe ("authorize", () => {
            it ("todo...", null);
        });
        describe ("ready", () => {
            it ("todo...", null);
        });
    });

});
