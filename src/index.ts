import { FhirClient as NS } from "..";
// import "whatwg-fetch";
import * as oAuth2 from "./oauth";
import Client from "./Client";

// New API ---------------------------------------------------------------------
window.SMART = {

    /**
     * Starts the authorization flow (redirects to the auth uri). This should be
     * called on the page that represents your launch_uri.
     * @param options
     */
    authorize(options: NS.ClientOptions) {
        return oAuth2.authorize(options);
    },

    /**
     * Completes the authorization flow. This should be called on the page that
     * represents your redirect_uri.
     */
    ready(): Promise<Client> {
        return oAuth2.completeAuth();
    },

    /**
     * Calls `authorize` or `ready` depending on the URL parameters. Can be used
     * to handle everything in one page (when the launch_uri and redirect_uri of
     * your smart client are the same)
     */
    init(options: NS.ClientOptions): Promise<Client> | void {
        // todo...
    }
};

// Legacy API ------------------------------------------------------------------
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
