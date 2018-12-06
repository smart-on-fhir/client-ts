import * as Lab                    from "lab";
import { expect }                  from "code";
import * as oauth                  from "../src/oauth";
import Adapter                     from "../src/adapter";
import * as request                from "request";
import { FhirClient }              from "..";
// import { urlParam, urlToAbsolute } from "../src/lib";
// import { JSDOM }                   from "jsdom";
import Client                      from "../src/Client";


interface ExtendedGlobal extends NodeJS.Global {
    document: any;
    sessionStorage: any;
    location: Location;
}

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
                    // return Promise.reject({
                    //     error,
                    //     data: error,
                    //     config: args
                    // });
                    return reject(error);
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

Adapter.set(adapterStub);


describe("Client", () => {

    // beforeEach(() => {
    //     const _data = {};
    //     (global as ExtendedGlobal).sessionStorage = {
    //         setItem(id, value) {
    //             _data[id] = value;
    //         },
    //         getItem(id) {
    //             return _data[id];
    //         },
    //         get() {
    //             return { ..._data };
    //         }
    //     };

    //     const dom = new JSDOM(``, {
    //         url: "http://localhost/a/b/c",
    //     });

    //     (global as ExtendedGlobal).document = dom.window.document;
    //     (global as ExtendedGlobal).location = dom.window.location;
    // });

    // afterEach(() => {
    //     delete (global as ExtendedGlobal).sessionStorage;
    //     delete (global as ExtendedGlobal).document;
    //     delete (global as ExtendedGlobal).location;
    // });






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
        expect(client.request({ url: "/metadata" })).not.to.reject();
    });

});
