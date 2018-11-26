import * as Lab       from "lab";
import { expect }     from "code";
import * as oauth     from "../src/oauth";
import Adapter        from "../src/adapter";
import * as request   from "request";
import { FhirClient } from "..";
import { urlParam }   from "../src/lib";


const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;
export { lab };


const adapterStub = {
    http(args) {
        const opts = {
            type    : args.method,
            url     : args.url,
            dataType: args.dataType || "json",
            headers : args.headers || {},
            data    : args.data,
            // contentType: "application/json",
            // data: args.data || args.params,
            // withCredentials: args.credentials === 'include',
        };
        return new Promise((resolve, reject) => {
            request(opts, (error, resp) => {
                if (error) {
                    return Promise.reject({
                        error,
                        data: error,
                        config: args
                    });
                }

                resolve({
                    data: resp.body,
                    status: resp.statusCode,
                    headers: resp.headers,
                    config: args
                });
            });
        });
    }
};


describe("oauth", () => {

    beforeEach(() => {
        const _data = {};
        global.sessionStorage = {
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
    });

    afterEach(() => {
        delete global.sessionStorage;
    });

    describe("fetchConformanceStatement", () => {
        it ("works", ({ context }) => {
            Adapter.set(adapterStub);
            oauth.fetchConformanceStatement("https://r3.smarthealthit.org");
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
            });
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
            });
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
            });
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
            });
            expect(extensions).to.equal({
                registrationUri : "registration-uri",
                authorizeUri    : "authorize-uri",
                tokenUri        : "token-uri"
            });
        });
    });

    describe("authorize", () => {

        it ("redirects to the proper URL", async () => {
        //     const dummyLocation = {
        //         protocol: "http://",
        //         host    : "localhost",
        //         pathname: "/",
        //         search  : "?"
        //     } as Location;
        //     await oauth.authorize(dummyLocation, {} as FhirClient.ClientOptions);
        //     expect(dummyLocation.href).to.equal(
        //         ""
        //     );
        });
    });

    describe("buildAuthorizeUrl", () => {
        it ("requires server url to be specified", () => {
            const dummyLocation = {
                protocol: "http://",
                host    : "localhost",
                pathname: "/",
                search  : "?"
            } as Location;

            expect(
                oauth.buildAuthorizeUrl(dummyLocation, {} as FhirClient.ClientOptions)
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
                oauth.buildAuthorizeUrl(dummyLocation, {} as FhirClient.ClientOptions)
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
                oauth.buildAuthorizeUrl(dummyLocation, {} as FhirClient.ClientOptions)
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
                oauth.buildAuthorizeUrl(dummyLocation, { serverUrl: "http://r3.smarthealthit.org" } as FhirClient.ClientOptions)
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
                oauth.buildAuthorizeUrl(dummyLocation, {} as FhirClient.ClientOptions)
            ).to.reject(Error, `Missing url parameter "launch"`);
        });

        it ("appends clientSecret to the state", async () => {
            const dummyLocation = {
                protocol: "http:",
                host    : "localhost",
                pathname: "/",
                search  : "?"
            } as Location;

            await oauth.buildAuthorizeUrl(dummyLocation, {
                serverUrl: "http://r3.smarthealthit.org",
                clientId : "my-client-id",
                clientSecret: "mySecret",
                // redirectUri: "wherever"
            } as FhirClient.ClientOptions);

            const data = sessionStorage.get();
            const key  = Object.keys(data)[0];

            expect(JSON.parse(data[key])).to.equal({
                serverUrl       : "http://r3.smarthealthit.org",
                clientId        : "my-client-id",
                redirectUri     : "http://localhost/",
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
                url   : "my-tokenUri",
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                data: {
                    client_id   : "my-clientId",
                    code        : "my-code",
                    grant_type  : "authorization_code",
                    redirect_uri: "my-redirectUri"
                }
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
                url   : "my-tokenUri",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    Authorization: "Basic " + Buffer.from("my-clientId:my-clientSecret").toString("base64")
                },
                data: {
                    code        : "my-code",
                    grant_type  : "authorization_code",
                    redirect_uri: "my-redirectUri"
                }
            });
        });

    });

    describe("getState", () => {
        it ("TODO: Write tests", null);
    });

    describe("completeAuth", () => {
        it ("TODO: Write tests", null);
    });

});
