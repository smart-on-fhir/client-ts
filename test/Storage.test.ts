import * as Lab   from "lab";
import { expect } from "code";
import { JSDOM }  from "jsdom";
import Storage    from "../src/Storage";

const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;
export { lab };

interface ExtendedGlobal extends NodeJS.Global {
    document: Document;
    window: Window;
    sessionStorage: any;
}

beforeEach(() => {
    const _data = {};
    const dom = new JSDOM(``, { url: "http://localhost/a/b/c" });
    (global as ExtendedGlobal).window = dom.window;
    (global as ExtendedGlobal).sessionStorage = {
        setItem(id, value) {
            _data[id] = value;
        },
        getItem(id) {
            return _data[id];
        },
        removeItem(key) {
            if (_data.hasOwnProperty(key)) {
                delete _data[key];
            }
        },
        get() {
            return { ..._data };
        }
    };
});

afterEach(() => {
    delete (global as ExtendedGlobal).window;
});

describe("Storage", () => {

    describe("key", () => {
        it ("returns undefined if 'smartId' key does not exist", () => {
            expect(Storage.key()).to.equal(undefined);
        });
        it ("returns the value under 'smartId' key", () => {
            sessionStorage.setItem("smartId", "test-smart-id");
            expect(Storage.key()).to.equal("test-smart-id");
        });
    });

    describe("set", () => {
        it ("can set nested json objects", () => {
            sessionStorage.setItem("smartId", "test-smart-id");
            Storage.set({ a: { b: 2 }});
            expect(sessionStorage.getItem("test-smart-id")).to.equal(`{"a":{"b":2}}`);
        });
    });

    describe("get", () => {
        it ("returns null if smartId is not set", () => {
            expect(Storage.get()).to.equal(null);
        });

        it ("returns null if no data is found", () => {
            sessionStorage.setItem("smartId", "test-smart-id");
            expect(Storage.get()).to.equal(null);
        });

        it ("returns null if sessionStorage contains invalid json", () => {
            sessionStorage.setItem("smartId", "test-smart-id");
            sessionStorage.setItem("test-smart-id", `bad-json`);
            expect(Storage.get()).to.equal(null);
        });

        it ("returns json objects", () => {
            sessionStorage.setItem("smartId", "test-smart-id");
            sessionStorage.setItem("test-smart-id", `{"a":{"b":2}}`);
            expect(Storage.get()).to.equal({"a": {"b": 2}});
        });

        it ("can query json objects by path", () => {
            sessionStorage.setItem("smartId", "test-smart-id");
            sessionStorage.setItem("test-smart-id", `{"a":{"b":2}}`);
            expect(Storage.get("a")).to.equal({"b": 2});
            expect(Storage.get("a.b")).to.equal(2);
        });

        it ("using a query on empty state returns null", () => {
            sessionStorage.setItem("smartId", "test-smart-id");
            expect(Storage.get("a.b")).to.equal(undefined);
        });
    });

    describe("extend", () => {
        it ("can shallow-merge objects", () => {
            sessionStorage.setItem("smartId", "test-smart-id");
            sessionStorage.setItem("test-smart-id", `{"a":{"b":2}}`);
            Storage.extend({ a: { c: 4 }});
            expect(Storage.get()).to.equal({ a: { c: 4 }});
            Storage.extend({ b: 3 });
            expect(Storage.get()).to.equal({ a: { c: 4 }, b: 3 });
        });

        it ("can also be used to create initial state", () => {
            sessionStorage.setItem("smartId", "test-smart-id");
            Storage.extend({ a: { c: 4 }});
            expect(Storage.get()).to.equal({ a: { c: 4 }});
        });
    });

    describe("clear", () => {
        it ("works", () => {
            sessionStorage.setItem("smartId", "test-smart-id");
            sessionStorage.setItem("test-smart-id", `{"a":{"b":2}}`);
            Storage.clear();
            expect(sessionStorage.getItem("test-smart-id")).to.equal(undefined);
        });
    });
});
