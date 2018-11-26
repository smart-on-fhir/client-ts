import { FhirClient as NS }     from "..";
// import * as lib    from "./lib";
// import Client      from "./Client";
import * as oAuth2 from "./oauth";

// const mkFhir = require("fhir.js/src/adapters/jquery");

declare global {
    interface Window {
        FHIR: any;
    }
}

window.FHIR = {
    // lib,
    // client,
    // ready(options = {
    //     baseUrl: "https://r3.smarthealthit.org/"
    // }) {
    //     // debugger;
    //     return mkFhir(options);
    // },
    oAuth2: {
        settings: {
            replaceBrowserHistory    : true,
            fullSessionStorageSupport: true
        },
        authorize(options: NS.ClientOptions) {
            return oAuth2.authorize(location, options);
        },
        ready() {
            return oAuth2.completeAuth(sessionStorage);
        }
    }
};

export default {};
