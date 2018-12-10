import "isomorphic-fetch";
import * as Lab                    from "lab";
import { expect }                  from "code";
import * as oauth                  from "../src/oauth";
import * as request                from "request";
import { FhirClient, fhir }        from "..";
import { urlParam, urlToAbsolute } from "../src/lib";
import { JSDOM }                   from "jsdom";


interface ExtendedGlobal extends NodeJS.Global {
    document: Document;
    window: Window;
    sessionStorage: any;
    location: Location;
    btoa: (str: string) => string;
}

const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;
export { lab };


const adapterStub = {
    http(args): any {
        const opts = {
            json    : true,
            headers : {},
            // contentType: "application/json",
            // data: args.data || args.params,
            // withCredentials: args.credentials === 'include',
            ...args,
            form : args.data,
            data: undefined
        };

        return new Promise((resolve, reject) => {
            request(opts, (error, resp) => {
                if (error) {
                    // return Promise.reject({
                    //     error,
                    //     data: error,
                    //     config: args
                    // });
                    return reject(error);
                }

                if (resp.statusCode >= 400) {
                    // console.log(
                    //     `Request returned statusCode ${resp.statusCode} \n${
                    //         JSON.stringify(opts, null, 4)
                    //     }\n${
                    //         JSON.stringify(resp.body, null, 4)
                    //     }`
                    // );
                    return reject(new Error(`Request returned statusCode ${resp.statusCode}`));
                }

                resolve({
                    data   : resp.body,
                    status : resp.statusCode,
                    headers: resp.headers,
                    config : args
                });
            });
        });
    }
};


describe("oauth", () => {

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

    describe("fetchConformanceStatement", () => {
        it ("rejects bad baseUrl values", () => {
            expect(oauth.fetchConformanceStatement("")).to.reject();
            expect(oauth.fetchConformanceStatement(null)).to.reject();
            expect(oauth.fetchConformanceStatement("whatever")).to.reject();
        });

        it ("without baseUrl fetches '/metadata' rooted at the current domain", () => {
            expect(oauth.fetchConformanceStatement()).to.reject();
        });

        it ("works on custom ports", () => {
            const dom = new JSDOM(``, { url: "http://localhost:1234/a/b/c" });
            (global as ExtendedGlobal).document = dom.window.document;
            (global as ExtendedGlobal).location = dom.window.location;
            expect(oauth.fetchConformanceStatement("")).to.reject();
        });

        it ("works", async () => {
            const metadata = await oauth.fetchConformanceStatement("https://r3.smarthealthit.org");
            expect(metadata).to.be.an.object();
            expect(metadata.resourceType).to.equal("CapabilityStatement");
        });
    });

    describe("getSecurityExtensions", () => {
        it ("works without arguments", () => {
            const extensions = oauth.getSecurityExtensions();
            expect(extensions).to.equal({
                registrationUri : "",
                authorizeUri    : "",
                tokenUri        : ""
            });
        });

        it ("finds registrationUri", () => {
            const extensions = oauth.getSecurityExtensions({
                fhirVersion: "whatever",
                rest: [{
                    security: {
                        extension: [
                            {
                                url: "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
                                "extension": [
                                    {
                                        "url": "register",
                                        "valueUri": "registration-uri"
                                    }
                                ]
                            }
                        ]
                    },
                    resource: [{
                        type: "whatever"
                    }]
                }]
            } as fhir.CapabilityStatement);
            expect(extensions).to.equal({
                registrationUri : "registration-uri",
                authorizeUri    : "",
                tokenUri        : ""
            });
        });

        it ("finds tokenUriUri", async () => {
            const extensions = oauth.getSecurityExtensions({
                fhirVersion: "whatever",
                rest: [{
                    security: {
                        extension: [
                            {
                                url: "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
                                "extension": [
                                    {
                                        "url": "token",
                                        "valueUri": "token-uri"
                                    }
                                ]
                            }
                        ]
                    },
                    resource: [{
                        type: "whatever"
                    }]
                }]
            } as fhir.CapabilityStatement);
            expect(extensions).to.equal({
                registrationUri : "",
                authorizeUri    : "",
                tokenUri        : "token-uri"
            });
        });

        it ("finds authorizeUri", () => {
            const extensions = oauth.getSecurityExtensions({
                fhirVersion: "whatever",
                rest: [{
                    security: {
                        extension: [
                            {
                                url: "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
                                "extension": [
                                    {
                                        "url": "authorize",
                                        "valueUri": "authorize-uri"
                                    }
                                ]
                            }
                        ]
                    },
                    resource: [{
                        type: "whatever"
                    }]
                }]
            } as fhir.CapabilityStatement);
            expect(extensions).to.equal({
                registrationUri : "",
                authorizeUri    : "authorize-uri",
                tokenUri        : ""
            });
        });

        it ("finds all extensions", () => {
            const extensions = oauth.getSecurityExtensions({
                fhirVersion: "whatever",
                rest: [{
                    security: {
                        extension: [
                            {
                                url: "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
                                "extension": [
                                    {
                                        "url": "authorize",
                                        "valueUri": "authorize-uri"
                                    },
                                    {
                                        "url": "token",
                                        "valueUri": "token-uri"
                                    },
                                    {
                                        "url": "register",
                                        "valueUri": "registration-uri"
                                    }
                                ]
                            }
                        ]
                    },
                    resource: [{
                        type: "whatever"
                    }]
                }]
            } as fhir.CapabilityStatement);
            expect(extensions).to.equal({
                registrationUri : "registration-uri",
                authorizeUri    : "authorize-uri",
                tokenUri        : "token-uri"
            });
        });
    });

    describe("authorize", () => {

        it ("redirects to the proper URL", async () => {
            const dummyLocation = {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?fhirServiceUrl=http://launch.smarthealthit.org/v/r3/fhir&launch=123"
            } as Location;

            await oauth.authorize({
                // serverUrl       : "http://r3.smarthealthit.org",
                clientId        : "my-client-id",
                redirectUri     : "http://localhost/a/b/",
                clientSecret    : "mySecret",
                scope           : "a b c",
                registrationUri : "my-registrationUri",
                authorizeUri    : "my-authorizeUri",
                tokenUri        : "my-tokenUri"
            } as FhirClient.ClientOptions, dummyLocation);

            const location = { search: "?" + (dummyLocation.href.split("?")[1] || "") } as Location;
            // console.log(location.search);
            expect(urlParam("response_type", { location })).to.equal("code");
            expect(urlParam("client_id", { location })).to.equal("my-client-id");
            expect(urlParam("scope", { location })).to.equal("a b c");
            expect(urlParam("redirect_uri", { location })).to.equal("http://localhost/a/b/");
            expect(urlParam("aud", { location })).to.equal("http://launch.smarthealthit.org/v/r3/fhir");
            expect(urlParam("state", { location })).to.be.a.string();
            expect(urlParam("launch", { location })).to.equal("123");
        });

        it ("works with the global location", async () => {

            const dom = new JSDOM(``, {
                url: "http://localhost/a/b/c?fhirServiceUrl=http://launch.smarthealthit.org/v/r3/fhir&launch=123",
            });

            (global as ExtendedGlobal).document = dom.window.document;
            (global as ExtendedGlobal).location = dom.window.location;

            const _consoleError = console.error;
            console.error = () => {
                // temp. stub to catch a console.error call made in JSDOM...
            };
            const url = await oauth.authorize({
                // serverUrl       : "http://r3.smarthealthit.org",
                clientId        : "my-client-id",
                redirectUri     : "http://localhost/a/b/",
                clientSecret    : "mySecret",
                scope           : "a b c",
                registrationUri : "my-registrationUri",
                authorizeUri    : "my-authorizeUri",
                tokenUri        : "my-tokenUri"
            } as FhirClient.ClientOptions);
            console.error = _consoleError;

            const location = { search: "?" + (url.split("?")[1] || "") } as Location;
            // console.log(location.search);
            expect(urlParam("response_type", { location })).to.equal("code");
            expect(urlParam("client_id", { location })).to.equal("my-client-id");
            expect(urlParam("scope", { location })).to.equal("a b c");
            expect(urlParam("redirect_uri", { location })).to.equal("http://localhost/a/b/");
            expect(urlParam("aud", { location })).to.equal("http://launch.smarthealthit.org/v/r3/fhir");
            expect(urlParam("state", { location })).to.be.a.string();
            expect(urlParam("launch", { location })).to.equal("123");
        });

        it ("throws if location redirects are not possible", async () => {

            await expect(oauth.authorize({
                // serverUrl       : "http://r3.smarthealthit.org",
                clientId        : "my-client-id",
                redirectUri     : "http://localhost/a/b/",
                clientSecret    : "mySecret",
                scope           : "a b c",
                registrationUri : "my-registrationUri",
                authorizeUri    : "my-authorizeUri",
                tokenUri        : "my-tokenUri"
            } as FhirClient.ClientOptions, {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?fhirServiceUrl=http://launch.smarthealthit.org/v/r3/fhir&launch=123",
                set href(value) {
                    throw new Error("test error");
                }
            } as Location)).to.reject(Error, /test error/);
        });
    });

    describe("buildAuthorizeUrl", () => {

        it ("can work with the current location", () => {
            expect(
                oauth.buildAuthorizeUrl({} as FhirClient.ClientOptions)
            ).to.reject(Error, /^No server url\b/i);
        });

        it ("requires server url to be specified", () => {
            const dummyLocation = {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?"
            } as Location;

            expect(
                oauth.buildAuthorizeUrl({} as FhirClient.ClientOptions, dummyLocation)
            ).to.reject(Error, /^No server url\b/i);
        });

        it (`the server url can be specified as "query.iss"`, async () => {
            const dummyLocation = {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?iss=http://r3.smarthealthit.org&launch=b"
            } as Location;

            await expect(
                oauth.buildAuthorizeUrl({} as FhirClient.ClientOptions, dummyLocation)
            ).not.to.reject();
        });

        it (`the server url can be specified as "query.fhirServiceUrl"`, async () => {
            const dummyLocation = {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?fhirServiceUrl=http://r3.smarthealthit.org"
            } as Location;

            await expect(
                oauth.buildAuthorizeUrl({} as FhirClient.ClientOptions, dummyLocation)
            ).not.to.reject();
        });

        it (`the server url can be specified as "options.serverUrl"`, async () => {
            const dummyLocation = {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?"
            } as Location;

            await expect(
                oauth.buildAuthorizeUrl({ serverUrl: "http://r3.smarthealthit.org" } as FhirClient.ClientOptions, dummyLocation)
            ).not.to.reject();
        });

        it (`requires "launch" query param if "iss" is specified`, async () => {
            const dummyLocation = {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?iss=http://r3.smarthealthit.org"
            } as Location;

            await expect(
                oauth.buildAuthorizeUrl({} as FhirClient.ClientOptions, dummyLocation)
            ).to.reject(Error, `Missing url parameter "launch"`);
        });

        it (`redirectUri defaults to "."`, async () => {
            await oauth.buildAuthorizeUrl({
                serverUrl: "http://r3.smarthealthit.org",
                clientId : "my-client-id",
                clientSecret: "mySecret",
                // redirectUri: "wherever"
            } as FhirClient.ClientOptions);

            const data = sessionStorage.get();
            const key  = Object.keys(data)[0];

            expect(JSON.parse(data[key]).redirectUri).to.equal("http://localhost/a/b/");
        });

        it (`redirectUri is resolved as relative to the current domain`, async () => {
            await oauth.buildAuthorizeUrl({
                serverUrl: "http://r3.smarthealthit.org",
                clientId : "my-client-id",
                clientSecret: "mySecret",
                redirectUri: "wherever"
            } as FhirClient.ClientOptions);

            const data = sessionStorage.get();
            const key  = Object.keys(data)[0];

            expect(JSON.parse(data[key]).redirectUri).to.equal("http://localhost/a/b/wherever");
        });

        it (`options.scope end up in the storage`, async () => {
            await oauth.buildAuthorizeUrl({
                serverUrl: "http://r3.smarthealthit.org",
                clientId : "my-client-id",
                clientSecret: "mySecret",
                scope: "wherever"
            } as FhirClient.ClientOptions);

            const data = sessionStorage.get();
            const key  = Object.keys(data)[0];

            expect(JSON.parse(data[key]).scope).to.equal("wherever");
        });

        it ("appends clientSecret to the state", async () => {
            const dummyLocation = {
                protocol: "http:",
                host    : "localhost",
                pathname: "/",
                search  : "?"
            } as Location;

            await oauth.buildAuthorizeUrl({
                serverUrl: "http://r3.smarthealthit.org",
                clientId : "my-client-id",
                clientSecret: "mySecret",
                // redirectUri: "wherever"
            } as FhirClient.ClientOptions, dummyLocation);

            const data = sessionStorage.get();
            const key  = Object.keys(data)[0];

            expect(JSON.parse(data[key])).to.equal({
                serverUrl       : "http://r3.smarthealthit.org",
                clientId        : "my-client-id",
                redirectUri     : "http://localhost/a/b/",
                clientSecret    : "mySecret",
                scope           : "",
                registrationUri : "",
                authorizeUri    : "",
                tokenUri        : ""
            });

            // let stateId = urlParam({ search: url.split("?")[1] + "?" } as Location, "state");
            // console.log(url, stateId)
            // expect(sessionStorage.getItem(stateId as string).clientSecret).to.equal("mySecret");
        });

        it ("appends any oauth endpoints to the state", async () => {
            const dummyLocation = {
                protocol: "http:",
                host    : "localhost",
                pathname: "/",
                search  : "?fhirServiceUrl=http://launch.smarthealthit.org/v/r3/fhir"
            } as Location;

            await oauth.buildAuthorizeUrl({
                clientId : "my-client-id",
                clientSecret: "mySecret",
                // redirectUri: "wherever"
            } as FhirClient.ClientOptions, dummyLocation);

            const data  = sessionStorage.get();
            const key   = Object.keys(data)[0];
            const state = JSON.parse(data[key]);

            expect(state.authorizeUri).to.equal("http://launch.smarthealthit.org/v/r3/auth/authorize");
            expect(state.tokenUri    ).to.equal("http://launch.smarthealthit.org/v/r3/auth/token");

            // let stateId = urlParam({ search: url.split("?")[1] + "?" } as Location, "state");
            // console.log(url, stateId)
            // expect(sessionStorage.getItem(stateId as string).clientSecret).to.equal("mySecret");
        });

        it ("appends `launch` to the redirect url if provided", async () => {
            const dummyLocation = {
                protocol: "http:",
                host    : "localhost",
                pathname: "/",
                search  : "?fhirServiceUrl=http://launch.smarthealthit.org/v/r3/fhir&launch=123"
            } as Location;

            const redirect = await oauth.buildAuthorizeUrl({
                clientId : "my-client-id",
                clientSecret: "mySecret",
                // redirectUri: "wherever"
            } as FhirClient.ClientOptions, dummyLocation);

            const launch = urlParam("launch", { location: { search: "?" + redirect.split("?")[1] } as Location });
            // console.log(url, stateId)
            expect(launch).to.equal("123");
        });

    });

    describe("buildTokenRequest", () => {

        it ("throws on missing state.redirectUri", () => {
            expect(() => oauth.buildTokenRequest(
                "code",
                {} as FhirClient.ClientState
            )).to.throw(Error, "Missing state.redirectUri");
        });

        it ("throws on missing state.tokenUri", () => {
            expect(() => oauth.buildTokenRequest(
                "code",
                {
                    redirectUri: "whatever"
                } as FhirClient.ClientState
            )).to.throw(Error, "Missing state.tokenUri");
        });

        it ("throws on missing state.clientId", () => {
            expect(() => oauth.buildTokenRequest(
                "code",
                {
                    redirectUri: "whatever",
                    tokenUri   : "whatever"
                } as FhirClient.ClientState
            )).to.throw(Error, "Missing state.clientId");
        });

        it ("works without clientSecret", () => {
            expect(oauth.buildTokenRequest(
                "my-code",
                {
                    redirectUri: "my-redirectUri",
                    tokenUri   : "my-tokenUri",
                    clientId   : "my-clientId"
                } as FhirClient.ClientState
            )).to.equal({
                method: "POST",
                // url   : "my-tokenUri",
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                body: `code=my-code&grant_type=authorization_code&redirect_uri=my-redirectUri&client_id=my-clientId`
                // data: {
                //     client_id   : "my-clientId",
                //     code        : "my-code",
                //     grant_type  : "authorization_code",
                //     redirect_uri: "my-redirectUri"
                // }
            });
        });

        it ("works with clientSecret", () => {
            expect(oauth.buildTokenRequest(
                "my-code",
                {
                    redirectUri : "my-redirectUri",
                    tokenUri    : "my-tokenUri",
                    clientId    : "my-clientId",
                    clientSecret: "my-clientSecret"
                } as FhirClient.ClientState
            )).to.equal({
                method: "POST",
                // url   : "my-tokenUri",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    Authorization: "Basic " + Buffer.from("my-clientId:my-clientSecret").toString("base64")
                },
                body: `code=my-code&grant_type=authorization_code&redirect_uri=my-redirectUri`
                // data: {
                //     code        : "my-code",
                //     grant_type  : "authorization_code",
                //     redirect_uri: "my-redirectUri"
                // }
            });
        });

    });

    // describe("getState", () => {
    //     it ("throws if called with falsy ID", () => {
    //         // tslint:disable
    //         // expect(() => oauth.getState(         )).to.throw(Error, /^Cannot look up state by the given id/);
    //         expect(() => oauth.getState(""       )).to.throw(Error, /^Cannot look up state by the given id/);
    //         // expect(() => oauth.getState(false    )).to.throw(Error, /^Cannot look up state by the given id/);
    //         expect(() => oauth.getState(null     )).to.throw(Error, /^Cannot look up state by the given id/);
    //         expect(() => oauth.getState(undefined)).to.throw(Error, /^Cannot look up state by the given id/);
    //         // expect(() => oauth.getState(0        )).to.throw(Error, /^Cannot look up state by the given id/);
    //         // tslint:enable
    //     });

    //     it ("returns null if the ID is missing", () => {
    //         expect(oauth.getState("missingId")).to.equal(null);
    //     });

    //     it ("throws if the ID resolves to non-json value", () => {
    //         sessionStorage.setItem("badId", "bad value");
    //         expect(() => oauth.getState("badId")).to.throw(Error, "Corrupt state: sessionStorage['badId'] cannot be parsed as JSON.");
    //     });

    //     it ("works as expected", () => {
    //         const json: any = { a: 1, b: { c: 2 }};
    //         sessionStorage.setItem("goodId", JSON.stringify(json));
    //         expect(oauth.getState("goodId")).to.equal(json);
    //     });
    // });

    describe("completeAuth", () => {
        it ("rejects on error", async () => {
            const state = {
                redirectUri    : "my-redirectUri",
                tokenUri       : "http://launch.smarthealthit.org/v/r3/auth/token",
                clientId       : "my-clientId"
            };
            sessionStorage.setItem("my-state", JSON.stringify(state));
            sessionStorage.setItem("smartId", "my-state");

            const dom = new JSDOM(``, {
                url: `http://localhost/launch.html?state=my-state&code=my-code`,
            });

            (global as ExtendedGlobal).document = dom.window.document;
            (global as ExtendedGlobal).location = dom.window.location;
            await expect(oauth.completeAuth()).to.reject(); // no such code
        });

        it ("works as expected", async () => {

            // Pretend that we are at launch.html and FHIR.oAuth2.authorize
            // is called with options. Internally buildAuthorizeUrl will be called
            const authURL = await oauth.buildAuthorizeUrl({
                serverUrl      : "http://launch.smarthealthit.org/v/r3/fhir",
                clientId       : "my-clientId",
                redirectUri    : "my-redirectUri",
                authorizeUri   : "http://launch.smarthealthit.org/v/r3/auth/authorize",
                tokenUri       : "http://launch.smarthealthit.org/v/r3/auth/token",
                registrationUri: ""
            });

            // While constructing the auth URL new state have been stored. Get
            // it's sessionStorage key now.
            const stateKey = urlParam("state", {
                location: {
                    search: "?" + authURL.split("?").pop()
                } as Location
            });

            // Once we know the auth URL, load it and catch the response. This
            // is designed to be loaded in browsers and will reply with a redirect.
            // Make sure we don't follow the redirect and store it in a variable instead.
            const redirectURL = (await adapterStub.http({
                url: authURL,
                json: true,
                followAllRedirects: false,
                followRedirect: false,
                maxRedirects: 0
            })).headers.location;

            // Now pretend that we have followed the redirect at
            const dom = new JSDOM(``, {
                url: redirectURL
            });

            (global as ExtendedGlobal).document = dom.window.document;
            (global as ExtendedGlobal).location = dom.window.location;

            await expect(oauth.completeAuth()).not.to.reject();
        });
    });

});
