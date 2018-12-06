import * as Lab   from "lab";
import { expect } from "code";
import { JSDOM }  from "jsdom";
import * as lib   from "../src/lib";

const LOCATION = "http://localhost/a/b/c?_dummyName=_dummyValue";

const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;
export { lab };

interface ExtendedGlobal extends NodeJS.Global {
    document: any;
    location: Location;
}

describe("lib", () => {

    beforeEach(() => {
        const dom = new JSDOM(``, { url: LOCATION });
        (global as ExtendedGlobal).document = dom.window.document;
        (global as ExtendedGlobal).location = dom.window.location;
    });

    afterEach(() => {
        delete (global as ExtendedGlobal).document;
        delete (global as ExtendedGlobal).location;
    });

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
        it ("works with the global location", () => {
            expect(lib.urlParam("_dummyName")).to.equal("_dummyValue");
        });
        it ("returns null for missing params", () => {
            const location =  { search: "" } as Location;
            expect(lib.urlParam("x", { location })).to.equal(null);
        });
        it ("returns the first occurrence for single param", () => {
            const location =  { search: "?x=y" } as Location;
            expect(lib.urlParam("x", { location })).to.equal("y");
        });
        it ("returns the first occurrence for multiple params", () => {
            const location =  { search: "?x=1&x=2&y=3" } as Location;
            expect(lib.urlParam("x", { location })).to.equal("1");
        });
        it ("returns and array for multi-params when forceArray = true", () => {
            const location =  { search: "?x=1&x=2&y=3" } as Location;
            expect(lib.urlParam("x", { location, forceArray: true })).to.equal(["1", "2"]);
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

        const customDoc = new JSDOM(
            ``,
            { url: LOCATION.replace(/^http:/, "https:") }
        ).window.document;

        const map = new Map([
            ["/"        , "http://localhost/"         ],
            ["/x/y/z"   , "http://localhost/x/y/z"    ],
            [""         , LOCATION                    ],
            ["."        , "http://localhost/a/b/"     ],
            [".."       , "http://localhost/a/"       ],
            ["../"      , "http://localhost/a/"       ],
            ["../.."    , "http://localhost/"         ],
            ["../../"   , "http://localhost/"         ],
            ["../../.." , "http://localhost/"         ],
            ["../../../", "http://localhost/"         ],
            ["../d/e"   , "http://localhost/a/d/e"    ],
            ["./d/e"    , "http://localhost/a/b/d/e"  ],
            ["d/e"      , "http://localhost/a/b/d/e"  ],
            ["?x=y"     , "http://localhost/a/b/c?x=y"],
            ["//x/y/z"  , "http://x/y/z"              ]
        ]);

        map.forEach((value, key) => {
            it (`from "http://localhost/a/b/c" to "${key}" should produce "${value}"`, () => {
                expect(lib.urlToAbsolute(key/*, loc*/)).to.equal(value);
            });

            it (`from custom document to "${key}" should produce "${value}"`, () => {
                expect(lib.urlToAbsolute(key, customDoc)).to.equal(value.replace(/^http:/, "https:"));
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

});
