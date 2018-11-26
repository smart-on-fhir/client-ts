import client  from "./client";
import oauth2  from "./bb-client";
import adapter from "./adapter";

declare global {
    interface Window {
        FHIR: any;
    }
}

window.FHIR = {
  client,
  oauth2
};

export default adapter.set;
