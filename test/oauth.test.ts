import "isomorphic-fetch";
import * as nock      from "nock";
import * as Lab       from "lab";
import { expect }     from "code";
import * as request   from "request";
import { JSDOM }      from "jsdom";
import * as oauth     from "../src/oauth";
import { urlParam }   from "../src/lib";
import Client         from "../src/Client";
import { FhirClient } from "..";


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

    const dom = new JSDOM(``, { url: "http://localhost/a/b/c", });

    (global as ExtendedGlobal).window   = dom.window;
    (global as ExtendedGlobal).document = dom.window.document;
    (global as ExtendedGlobal).location = dom.window.location;
    (global as ExtendedGlobal).btoa = str => {
        return Buffer.from(str).toString("base64");
    };

    return new Promise((resolve) => {
        setTimeout(resolve, 10);
    });
});

afterEach(() => {
    delete (global as ExtendedGlobal).sessionStorage;
    delete (global as ExtendedGlobal).document;
    delete (global as ExtendedGlobal).location;
    delete (global as ExtendedGlobal).btoa;
    delete (global as ExtendedGlobal).window;
    nock.cleanAll();
});

describe("oauth", () => {

    describe("fetchConformanceStatement", () => {
        it ("rejects bad baseUrl values", async () => {
            await expect(oauth.fetchConformanceStatement("")).to.reject();
            await expect(oauth.fetchConformanceStatement(null)).to.reject();
            await expect(oauth.fetchConformanceStatement("whatever")).to.reject();
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

    describe("fetchWellKnownJson", () => {
        const mock = {
            "authorization_endpoint": "https://ehr.example.com/auth/authorize",
            "token_endpoint"        : "https://ehr.example.com/auth/token",
            "registration_endpoint" : "https://ehr.example.com/auth/register",
            "management_endpoint"   : "https://ehr.example.com/user/manage",
            "introspection_endpoint": "https://ehr.example.com/user/introspect",
            "revocation_endpoint"   : "https://ehr.example.com/user/revoke",
            "token_endpoint_auth_methods_supported": [
                "client_secret_basic"
            ],
            "scopes_supported": [
                "openid",
                "profile",
                "launch",
                "launch/patient",
                "patient/*.*",
                "user/*.*",
                "offline_access"
            ],
            "response_types_supported": [
                "code",
                "code id_token",
                "id_token",
                "refresh_token"
            ],
            "capabilities": [
                "launch-ehr",
                "client-public",
                "client-confidential-symmetric",
                "context-ehr-patient",
                "sso-openid-connect"
            ]
        };

        it ("works", async () => {
            nock("http://r3.smarthealthit.org").get("/.well-known/smart-configuration").reply(200, mock);
            const result = await oauth.fetchWellKnownJson("http://r3.smarthealthit.org");
            expect(result as any).to.equal(mock);
        });
    });

    describe("getSecurityExtensions", () => {
        it ("works with well-known json", async () => {
            const mock = {
                "authorization_endpoint": "https://ehr.example.com/auth/authorize",
                "token_endpoint"        : "https://ehr.example.com/auth/token",
                "registration_endpoint" : "https://ehr.example.com/auth/register",
                "management_endpoint"   : "https://ehr.example.com/user/manage",
                "introspection_endpoint": "https://ehr.example.com/user/introspect",
                "revocation_endpoint"   : "https://ehr.example.com/user/revoke",
                "token_endpoint_auth_methods_supported": [
                    "client_secret_basic"
                ],
                "scopes_supported": [
                    "openid",
                    "profile",
                    "launch",
                    "launch/patient",
                    "patient/*.*",
                    "user/*.*",
                    "offline_access"
                ],
                "response_types_supported": [
                    "code",
                    "code id_token",
                    "id_token",
                    "refresh_token"
                ],
                "capabilities": [
                    "launch-ehr",
                    "client-public",
                    "client-confidential-symmetric",
                    "context-ehr-patient",
                    "sso-openid-connect"
                ]
            };
            const server = "http://r3.smarthealthit.org";
            nock(server).get("/.well-known/smart-configuration").reply(200, mock);
            const extensions = await oauth.getSecurityExtensions(server);
            expect(extensions).to.equal({
                registrationUri : "https://ehr.example.com/auth/register",
                authorizeUri    : "https://ehr.example.com/auth/authorize",
                tokenUri        : "https://ehr.example.com/auth/token"
            });
        });

        it ("works without arguments", async () => {
            const server = "http://r3.smarthealthit.org";
            nock(server).get("/metadata").reply(200, {});
            const extensions = await oauth.getSecurityExtensions(server);
            expect(extensions).to.equal({
                registrationUri : "",
                authorizeUri    : "",
                tokenUri        : ""
            });
        });

        it ("finds registrationUri", async () => {
            const server = "http://r3.smarthealthit.org";
            nock(server).get("/metadata").reply(200, {
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
            });
            const extensions = await oauth.getSecurityExtensions(server);
            expect(extensions).to.equal({
                registrationUri : "registration-uri",
                authorizeUri    : "",
                tokenUri        : ""
            });
        });

        it ("finds tokenUriUri", async () => {
            const server = "http://r3.smarthealthit.org";
            nock(server).get("/metadata").reply(200, {
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
            });
            const extensions = await oauth.getSecurityExtensions(server);
            expect(extensions).to.equal({
                registrationUri : "",
                authorizeUri    : "",
                tokenUri        : "token-uri"
            });
        });

        it ("finds authorizeUri", async () => {
            const server = "http://r3.smarthealthit.org";
            nock(server).get("/metadata").reply(200, {
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
            });
            const extensions = await oauth.getSecurityExtensions(server);
            expect(extensions).to.equal({
                registrationUri : "",
                authorizeUri    : "authorize-uri",
                tokenUri        : ""
            });
        });

        it ("finds all extensions", async () => {
            const server = "http://r3.smarthealthit.org";
            nock(server).get("/metadata").reply(200, {
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
            });
            const extensions = await oauth.getSecurityExtensions(server);
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

        it ("throws if location redirects are not possible", () => {
            expect(oauth.authorize({
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

        it ("supports multiple configuration", async () => {
            await expect(oauth.buildAuthorizeUrl([{
                iss: /^https:\/\/google/
            }], {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?iss=http://r3.smarthealthit.org&launch=123"
            } as Location)).to.reject(
                Error,
                /^None of the provided configurations matched the current server\b/i
            );

            await expect(oauth.buildAuthorizeUrl([{
                iss: /^https:\/\/google/
            }], {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?fhirServiceUrl=http://r3.smarthealthit.org"
            } as Location)).to.reject(
                Error,
                /^None of the provided configurations matched the current server\b/i
            );

            await expect(oauth.buildAuthorizeUrl([{
                iss: /^http:\/\/launch\.smarthealthit\.org\/v\/r\d\/fhir\b/
            }], {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?fhirServiceUrl=http://launch.smarthealthit.org/v/r2/fhir"
            } as Location)).to.reject(
                Error,
                `A "clientId" option is required by this server`
            );
        });

        it ("can work with the current location", async () => {
            await expect(oauth.buildAuthorizeUrl()).to.reject(
                Error,
                /^No server url\b/i
            );
            await expect(oauth.buildAuthorizeUrl([])).to.reject(
                Error,
                /^None of the provided configurations matched the current server\b/i
            );
            await expect(oauth.buildAuthorizeUrl([{
                iss: "https://bad.iss"
            }])).to.reject(
                Error,
                /^None of the provided configurations matched the current server\b/i
            );
            await expect(oauth.buildAuthorizeUrl([{
                iss: /^https:\/\/google/
            }])).to.reject(
                Error,
                /^None of the provided configurations matched the current server\b/i
            );
            await expect(oauth.buildAuthorizeUrl([{
                iss: 123
            } as any])).to.reject(
                Error,
                /^None of the provided configurations matched the current server\b/i
            );
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

        it (`the server url can be specified as "query.iss"`, () => {
            const dummyLocation = {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?iss=http://r3.smarthealthit.org&launch=b"
            } as Location;

            expect(
                oauth.buildAuthorizeUrl({} as FhirClient.ClientOptions, dummyLocation)
            ).not.to.reject();
        });

        it (`the server url can be specified as "query.fhirServiceUrl"`, () => {
            const dummyLocation = {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?fhirServiceUrl=http://r3.smarthealthit.org"
            } as Location;

            expect(
                oauth.buildAuthorizeUrl({} as FhirClient.ClientOptions, dummyLocation)
            ).not.to.reject();
        });

        it (`the server url can be specified as "options.serverUrl"`, () => {
            const dummyLocation = {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?"
            } as Location;

            expect(
                oauth.buildAuthorizeUrl({ serverUrl: "http://r3.smarthealthit.org" } as FhirClient.ClientOptions, dummyLocation)
            ).not.to.reject();
        });

        it (`requires "launch" query param if "iss" is specified`, () => {
            const dummyLocation = {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?iss=http://r3.smarthealthit.org"
            } as Location;

            expect(
                oauth.buildAuthorizeUrl({} as FhirClient.ClientOptions, dummyLocation)
            ).to.reject(Error, `Missing url parameter "launch"`);
        });

        it (`redirectUri defaults to "."`, async () => {
            await oauth.buildAuthorizeUrl({
                serverUrl: "http://r3.smarthealthit.org",
                clientId : "my-client-id",
                clientSecret: "mySecret"
            } as FhirClient.ClientOptions);

            const key = sessionStorage.getItem("smartId");
            const data = sessionStorage.getItem(key);

            await expect(JSON.parse(data).redirectUri).to.equal("http://localhost/a/b/");
        });

        it (`redirectUri is resolved as relative to the current domain`, async () => {
            await oauth.buildAuthorizeUrl({
                serverUrl: "http://r3.smarthealthit.org",
                clientId : "my-client-id",
                clientSecret: "mySecret",
                redirectUri: "wherever"
            } as FhirClient.ClientOptions);

            const key = sessionStorage.getItem("smartId");
            const data = sessionStorage.getItem(key);

            await expect(JSON.parse(data).redirectUri).to.equal("http://localhost/a/b/wherever");
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

    describe("init", () => {
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

        it ("attempts to complete auth if code and state are present", () => {
            // const state = {
            //     redirectUri: "my-redirectUri",
            //     tokenUri   : "http://launch.smarthealthit.org/v/r3/auth/token",
            //     clientId   : "my-clientId"
            // };
            // sessionStorage.setItem("my-state", JSON.stringify(state));
            // sessionStorage.setItem("smartId", "my-state");

            const dom = new JSDOM(``, {
                url: `http://localhost/launch.html?state=my-fake-state&code=my-code`,
            });

            (global as ExtendedGlobal).document = dom.window.document;
            (global as ExtendedGlobal).location = dom.window.location;
            expect(oauth.init()).to.reject(
                Error, /^State key mismatch/
            );
        });

        it ("attempts to create a client if cached state is present", async () => {
            sessionStorage.setItem("my-state", JSON.stringify({
                serverUrl: "https://r3.smarthealthit.org"
            }));
            sessionStorage.setItem("smartId", "my-state");
            const client = await oauth.init();
            expect(client).to.be.instanceOf(Client);
        });

        it ("attempts to authorize otherwise", () => {
            // expect(oauth.getState("missingId")).to.equal(null);
        });

    //     it ("throws if the ID resolves to non-json value", () => {
    //         sessionStorage.setItem("badId", "bad value");
    //         expect(() => oauth.getState("badId")).to.throw(Error, "Corrupt state: sessionStorage['badId'] cannot be parsed as JSON.");
    //     });

    //     it ("works as expected", () => {
    //         const json: any = { a: 1, b: { c: 2 }};
    //         sessionStorage.setItem("goodId", JSON.stringify(json));
    //         expect(oauth.getState("goodId")).to.equal(json);
    //     });
    });

    describe("completeAuth", () => {
        it ("rejects on error", () => {
            const state = {
                redirectUri: "my-redirectUri",
                tokenUri   : "http://launch.smarthealthit.org/v/r3/auth/token",
                clientId   : "my-clientId"
            };
            sessionStorage.setItem("my-state", JSON.stringify(state));
            sessionStorage.setItem("smartId", "my-state");

            const dom = new JSDOM(``, {
                url: `http://localhost/launch.html?state=my-state&code=my-code`,
            });

            (global as ExtendedGlobal).document = dom.window.document;
            (global as ExtendedGlobal).location = dom.window.location;
            expect(oauth.completeAuth()).to.reject(); // no such code
        });

        it ("validates the state param", () => {
            const state = {
                redirectUri: "my-redirectUri",
                tokenUri   : "http://launch.smarthealthit.org/v/r3/auth/token",
                clientId   : "my-clientId"
            };
            sessionStorage.setItem("my-state", JSON.stringify(state));
            sessionStorage.setItem("smartId", "my-state");

            const dom = new JSDOM(``, {
                url: `http://localhost/launch.html?state=my-fake-state&code=my-code`,
            });

            (global as ExtendedGlobal).document = dom.window.document;
            (global as ExtendedGlobal).location = dom.window.location;
            expect(oauth.completeAuth()).to.reject(
                Error, /^State key mismatch/
            );
        });

        it ("works as expected", async () => {

            // Pretend that we are at launch.html and FHIR.oAuth2.authorize
            // is called with options. Internally buildAuthorizeUrl will be called
            const authURL = await oauth.buildAuthorizeUrl({
                serverUrl  : "http://launch.smarthealthit.org/v/r3/fhir",
                clientId   : "my-clientId",
                redirectUri: "my-redirectUri"
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
            const dom = new JSDOM(``, { url: redirectURL });
            (global as ExtendedGlobal).document = dom.window.document;
            (global as ExtendedGlobal).location = dom.window.location;

            expect(oauth.completeAuth()).not.to.reject();
        });
    });

});
