import * as Lab   from "lab";
import { expect } from "code";
import * as lib from "../src/lib";


const lab = Lab.script();
const { describe, it } = lab;
export { lab };


describe("lib", () => {

    describe("getPath", () => {
        it ("returns the first arg if no path", () => {
            const data = {};
            expect(lib.getPath(data)).to.equal(data);
        });
        it ("returns the first arg for empty path", () => {
            const data = {};
            expect(lib.getPath(data, "")).to.equal(data);
        });
        it ("works as expected", () => {
            const data = { a: 1, b: [0, { a: 2 }] };
            expect(lib.getPath(data, "b.1.a")).to.equal(2);
            expect(lib.getPath(data, "b.4.a")).to.equal(undefined);
        });
    });

    describe("urlParam", () => {
        it ("returns null for missing params", () => {
            const loc =  { search: "" } as Location;
            expect(lib.urlParam(loc, "x")).to.equal(null);
        });
        it ("returns the first occurrence for single param", () => {
            const loc =  { search: "?x=y" } as Location;
            expect(lib.urlParam(loc, "x")).to.equal("y");
        });
        it ("returns the first occurrence for multiple params", () => {
            const loc =  { search: "?x=1&x=2&y=3" } as Location;
            expect(lib.urlParam(loc, "x")).to.equal("1");
        });
        it ("returns and array for multi-params and true as second argument", () => {
            const loc =  { search: "?x=1&x=2&y=3" } as Location;
            expect(lib.urlParam(loc, "x", true)).to.equal(["1", "2"]);
        });
    });

    describe("stripTrailingSlash", () => {
        it ("returns the same string if it does not end with slash", () => {
            expect(lib.stripTrailingSlash("abc")).to.equal("abc");
        });

        it ("removes the trailing slash", () => {
            expect(lib.stripTrailingSlash("abc/")).to.equal("abc");
        });

        it ("removes repeated trailing slashes", () => {
            expect(lib.stripTrailingSlash("abc///")).to.equal("abc");
        });

        it ("works with non-string argument", () => {
            expect(lib.stripTrailingSlash(null)).to.equal("");
            expect(lib.stripTrailingSlash(false)).to.equal("");
            expect(lib.stripTrailingSlash(undefined)).to.equal("");
            expect(lib.stripTrailingSlash()).to.equal("");
            expect(lib.stripTrailingSlash(53)).to.equal("53");
            expect(lib.stripTrailingSlash(/abc/)).to.equal("/abc");
        });
    });

    describe("urlToAbsolute", () => {

        const loc =  {
            protocol: "http:",
            host    : "localhost",
            pathname: "/a/b/c"
        } as Location;

        const map = new Map([
            ["/"        , "http://localhost"        ],
            ["/x/y/z"   , "http://localhost/x/y/z"  ],
            [""         , "http://localhost/a/b/"   ],
            ["."        , "http://localhost/a/b/"   ],
            [".."       , "http://localhost/a"      ],
            ["../"      , "http://localhost/a/"     ],
            ["../.."    , "http://localhost"        ],
            ["../../"   , "http://localhost"        ],
            ["../../.." , "http://localhost"        ],
            ["../../../", "http://localhost"        ],
            ["../d/e"  , "http://localhost/a/d/e"   ],
            ["./d/e"   , "http://localhost/a/b/d/e" ],
            ["d/e"     , "http://localhost/a/b/d/e" ]
        ]);

        map.forEach((value, key) => {
            it (`from "http://localhost/a/b/c" to "${key}" should produce "${value}"`, () => {
            expect(lib.urlToAbsolute(key, loc)).to.equal(value);
            });
        });
    });

    describe("randomString", () => {
        it ("generates random strings", () => {
            const list = [];
            const length = 8;
            let i = 100;
            while (--i) {
                const rnd = lib.randomString(length);
                if (list.indexOf(rnd) > -1) {
                    throw new Error(
                        `Failed to create ${100 - i} random strings with length ${length}`
                    );
                }
                list.push(rnd);
            }
        });

        it ("length defaults to 8", () => {
            expect(lib.randomString().length).to.equal(8);
        });

        it ("supports custom char-sets", () => {
            expect(lib.randomString(16, "xy")).to.match(/^[xy]{16}$/);
        });
    });

    // describe("getSecurityExtensions", { timeout: 15000 }, () => {
    //     it ("Works without arguments", async() => {
    //         const extensions = await lib.getSecurityExtensions();
    //         expect(extensions).to.equal({
    //             registrationUri : "",
    //             authorizeUri    : "",
    //             tokenUri        : ""
    //         })
    //     });

    //     it ("Works with HSPC", { timeout: 5000 }, async() => {
    //         const extensions = await lib.getSecurityExtensions("https://api-stu3.hspconsortium.org/STU301withSynthea/data");
    //         expect(extensions).to.equal({
    //             registrationUri : "https://auth.hspconsortium.org/register",
    //             authorizeUri    : "https://auth.hspconsortium.org/authorize",
    //             tokenUri        : "https://auth.hspconsortium.org/token"
    //         });
    //     });

    //     it ("Works with R3 - Protected", async() => {
    //         const extensions = await lib.getSecurityExtensions("http://launch.smarthealthit.org/v/r3/sim/eyJhIjoiMSJ9/fhir");
    //         expect(extensions).to.equal({
    //             registrationUri : "",
    //             authorizeUri    : "http://launch.smarthealthit.org/v/r3/sim/eyJhIjoiMSJ9/auth/authorize",
    //             tokenUri        : "http://launch.smarthealthit.org/v/r3/sim/eyJhIjoiMSJ9/auth/token"
    //         });
    //     });

    //     it ("Works with R3 - Open", async() => {
    //         const extensions = await lib.getSecurityExtensions("http://r3.smarthealthit.org");
    //         expect(extensions).to.equal({
    //             registrationUri : "",
    //             authorizeUri    : "",
    //             tokenUri        : ""
    //         });
    //     });
    // });

});
