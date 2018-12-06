import { FhirClient as NS } from "..";
// import "whatwg-fetch";
import * as oAuth2 from "./oauth";

window.FHIR = {
    oAuth2: {
        settings: {
            replaceBrowserHistory    : true,
            fullSessionStorageSupport: true
        },
        authorize(options: NS.ClientOptions) {
            return oAuth2.authorize(options);
        },
        ready() {
            return oAuth2.completeAuth();
        }
    }
};
