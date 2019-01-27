
declare global {
    interface Window {
        FHIR: any;
        SMART: any;
        fhir?: (options?: any) => any; // might be set by fhir.js
    }
}

export namespace FhirClient {

    interface AuthorizeOptionSet {
        /**
         * The base URL of the Fhir server. If provided in the options, the app
         * will be launch-able byy simply accessing your launch URI without
         * requiring any parameters.
         */
        iss: string | RegExp;

        /**
         * The client_id that you should have obtained while registering your
         * app with the auth server or EHR.
         */
        clientId?: string;

        /**
         * The URI to redirect to after successful authorization. This must be
         * absolute path, relative to your site root, i.e. must begin with "/"
         */
        redirectUri?: string;

        /**
         * The access scopes that you need.
         * @see http://hl7.org/fhir/smart-app-launch/scopes-and-launch-context/index.html
         */
        scope?: string;

        /**
         * Your client secret if you have one (for confidential clients)
         */
        clientSecret?: string;
    }

     /**
     * Describes the options that one can/should pass to the functions that
     * accept configuration argument
     */
    interface AuthorizeOptions {
        /**
         * The base URL of the Fhir server. If provided in the options, the app
         * will be launch-able byy simply accessing your launch URI without
         * requiring any parameters.
         */
        serverUrl?: string;

        /**
         * The client_id that you should have obtained while registering your
         * app with the auth server or EHR.
         */
        clientId?: string;

        /**
         * The URI to redirect to after successful authorization. This must be
         * absolute path, relative to your site root, i.e. must begin with "/"
         */
        redirectUri?: string;

        /**
         * The access scopes that you need.
         * @see http://hl7.org/fhir/smart-app-launch/scopes-and-launch-context/index.html
         */
        scope?: string;

        /**
         * Your client secret if you have one (for confidential clients)
         */
        clientSecret?: string;
    }

    /**
     * The three security endpoints that SMART servers might declare in the
     * conformance statement
     */
    interface OAuthSecurityExtensions {

        /**
         * You could register new SMART client at this endpoint (if the server
         * supports dynamic client registration)
         */
        registrationUri: string;

        /**
         * You must call this endpoint to ask for authorization code
         */
        authorizeUri: string;

        /**
         * You must call this endpoint to exchange your authorization code
         * for an access token.
         */
        tokenUri: string;
    }

    /**
     * Describes the options that one can/should pass to the functions that
     * accept configuration argument
     */
    interface ClientOptions extends OAuthSecurityExtensions {
        /**
         * The base URL of the Fhir server. If provided in the options, the app
         * will be launch-able byy simply accessing your launch URI without
         * requiring any parameters.
         */
        serverUrl?: string;

        /**
         * The client_id that you should have obtained while registering your
         * app with the auth server or EHR.
         */
        clientId?: string;

        /**
         * The URI to redirect to after successful authorization. This must be
         * absolute path, relative to your site root, i.e. must begin with "/"
         */
        redirectUri?: string;

        /**
         * The access scopes that you need.
         * @see http://hl7.org/fhir/smart-app-launch/scopes-and-launch-context/index.html
         */
        scope?: string;

        /**
         * Your client secret if you have one (for confidential clients)
         */
        clientSecret?: string;
    }  

    interface OAuth2 {
        settings: OAuth2Config
    }

    
    /**
     * oauth2 settings
     */
    interface OAuth2Config {

        /**
         * Replaces the browser's current URL using the `history.replaceState`
         * API. Defaults to `true`.
         */
        replaceBrowserHistory?: boolean;

        /**
         * When set to true, this variable will fully utilize
         * HTML5 sessionStorage API. Defaults to true.
         * This variable can be overridden to false by setting
         * FHIR.oauth2.settings.fullSessionStorageSupport = false.
         * When set to false, the sessionStorage will be keyed
         * by a state variable. This is to allow the embedded IE browser
         * instances instantiated on a single thread to continue to
         * function without having sessionStorage data shared
         * across the embedded IE instances.
         */
        fullSessionStorageSupport?: boolean;
    }

    interface authorizeParams {
        response_type?: "code"
        server: string;
        fake_token_response: {
            patient: string;
        };
        provider: {
            oauth2: any;
        };
        client: {
            redirect_uri: string;
            scope       : string;
            launch      : string;
            state       : string; // guid
        }
    }

    /**
     * The input object that can be passed as first parameter to
     * `FHIR.oauth2.ready`
     */
    interface readyInput {
        code?: string;
        state?: string;
    }

    // type readyCallback  = (client: any) => any;
    // type readyErrorback = (error: Error | string) => any;
    
    // type readyArgsFn1 = [readyCallback];
    // type readyArgsFn2 = [readyCallback, readyErrorback];
    // type readyArgsFn3 = [readyInput, readyCallback];
    // type readyArgsFn4 = [readyInput, readyCallback, readyErrorback];
    // type readyArgsResult = {
    //     input   : readyInput;
    //     callback: readyCallback;
    //     errback : readyErrorback;
    // }
    // type readyFnArgs  = readyArgsFn1 | readyArgsFn2 | readyArgsFn3 | readyArgsFn4;
}

export namespace Client {
    
    /**
     * The API exposed by fhir.js
     */
    interface FhirJsAPI {
        [key: string]: any;
    }

    interface Patient {
        id: string;
        read: () => Promise<fhir.Resource>;
        api?: FhirJsAPI;
    }

    interface Encounter {
        id: string;
        read: () => Promise<fhir.Resource>;
    }
    
    interface User {
        id: string;
        type: string; // Patient, Practitioner, RelatedPerson...
        read: () => Promise<fhir.Resource>;
    }
    
    /**
     * Describes the state that should be passed to the Client constructor
     */
    interface State {
        /**
         * The base URL of the Fhir server. The library should have detected it
         * at authorization time from request query params of from config options.
         */
        serverUrl: string;

        /**
         * The client_id that you should have obtained while registering your
         * app with the auth server or EHR (as set in the configuration options)
         */
        clientId: string;

        /**
         * The URI to redirect to after successful authorization, as set in the
         * configuration options.
         */
        redirectUri: string;

        /**
         * The access scopes that you requested in your options (or an empty string).
         * @see http://hl7.org/fhir/smart-app-launch/scopes-and-launch-context/index.html
         */
        scope: string;

        /**
         * Your client secret if you have one (for confidential clients)
         */
        clientSecret?: string;

        /**
         * The (encrypted) access token, in case you have completed the auth flow
         * already.
         */
        access_token?: string;

        /**
         * The response object received from the token endpoint while trying to
         * exchange the auth code for an access token (if you have reached that point).
         */
        tokenResponse?: SMART.TokenResponse;

        /**
         * You could register new SMART client at this endpoint (if the server
         * supports dynamic client registration)
         */
        registrationUri: string;

        /**
         * You must call this endpoint to ask for authorization code
         */
        authorizeUri: string;

        /**
         * You must call this endpoint to exchange your authorization code
         * for an access token.
         */
        tokenUri: string;
    }
}

/**
 * Describes various FHIR entities, but ONLY to the extend that we are using them
 */
export namespace fhir {

    type STU = 1|2|3|4;

    /**
     * An instant in time - known at least to the second and always includes a
     * time zone. Note: This is intended for precisely observed times (typically
     * system logs etc.), and not human-reported times - for them, use date and
     * dateTime. instant is a more constrained dateTime.
     * 
     * Patterns:
     * - `YYYY-MM-DDTHH:mm:ss.SSSSZ`
     * - `YYYY-MM-DDTHH:mm:ss.SSSZ`
     * - `YYYY-MM-DDTHH:mm:ssZ`
     */
    type instant = string;  // "2018-04-30T13:31:44.140-04:00"

    /**
     * A date, or partial date (e.g. just year or year + month) as used in human
     * communication. There is no time zone. Dates SHALL be valid dates.
     * 
     * Patterns:
     * - `YYYY-MM-DD`
     * - `YYYY-MM`
     * - `YYYY`
     * 
     * Regex: `-?[0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1]))?)?`
     */
    type date = string;

    /**
     * A date, date-time or partial date (e.g. just year or year + month) as
     * used in human communication. If hours and minutes are specified, a time
     * zone SHALL be populated. Seconds must be provided due to schema type
     * constraints but may be zero-filled and may be ignored. Dates SHALL be
     * valid dates. The time "24:00" is not allowed.
     *
     * Patterns:
     * - `YYYY-MM-DDTHH:mm:ss.SSSSZ`
     * - `YYYY-MM-DDTHH:mm:ss.SSSZ`
     * - `YYYY-MM-DDTHH:mm:ssZ`
     * - `YYYY-MM-DD`
     * - `YYYY-MM`
     * - `YYYY`
     *  
     * Regex: 
     * -?[0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1])(T([01]
     * [0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):
     * [0-5][0-9]|14:00)))?)?)?
     */
    type dateTime = string;

    /**
     * Any combination of upper or lower case ASCII letters ('A'..'Z', and
     * 'a'..'z', numerals ('0'..'9'), '-' and '.', with a length limit of 64
     * characters. (This might be an integer, an un-prefixed OID, UUID or any
     * other identifier pattern that meets these constraints.)
     * Regex: `[A-Za-z0-9\-\.]{1,64}`
     */
    type id = string;

    /**
     * A Uniform Resource Identifier Reference (RFC 3986 ). Note: URIs are case
     * sensitive. For UUID (urn:uuid:53fefa32-fcbb-4ff8-8a92-55ee120877b7) use
     * all lowercase. URIs can be absolute or relative, and may have an optional
     * fragment identifier.	
     */
    type uri = string;

    /**
     * Indicates that the value is taken from a set of controlled strings
     * defined elsewhere. Technically,  a code is restricted to a string which
     * has at least one character and no leading or trailing whitespace, and
     * where there is no whitespace other than single spaces in the contents
     * Regex: [^\s]+([\s]?[^\s]+)*
     */
    type code = string;

    /**
     * Any non-negative integer (e.g. >= 0)
     * Regex: [0]|([1-9][0-9]*)
     */
    type unsignedInt = number;

    /**
     * @see http://hl7.org/fhir/valueset-issue-type.html
     */
    type issueType = "invalid"|"structure"|"required"|"value"|"invariant"
        |"security"|"login"|"unknown"|"expired"|"forbidden"|"suppressed"
        |"processing"|"not"|"duplicate"|"not"|"too"|"code"|"extension"|"too"
        |"business"|"conflict"|"incomplete"|"transient"|"lock"|"no"|"exception"
        |"timeout"|"throttled"|"informational";

    
    type issueSeverity = "fatal" | "error" | "warning" | "information";


    interface Resource {
        /**
         * Logical id of this artifact
         */
        id ?: id;

        /**
         * Metadata about the resource
         */
        meta ?: Meta;

        /**
         * A set of rules under which this content was created
         */
        implicitRules ?: uri;

        /**
         * Language of the resource content
         */
        language ?: code;
    }

    interface Narrative extends Element	{
        /**
         * generated | extensions | additional | empty
         */
        status: code;
        /**
         * Limited xhtml content
         */
        div: string;
    }

    interface DomainResource extends Resource {
        /**
         * Text summary of the resource, for human interpretation
         */
        text : Narrative;
        
        /**
         * Contained, inline Resources
         */
        contained ?: Resource[];

        /**
         * Additional Content defined by implementations
         */
        extension ?: Extension[];
        
        /**
         * Extensions that cannot be ignored
         */
        modifierExtension ?: Extension[];
    }

    interface Element {
        id?: id;
        extension?: Extension[];
    }

    interface Extension extends Element {
        /**
         * identifies the meaning of the extension
         */
        url: uri;

        /**
         * "valueInteger" - integer
         * "valueUnsignedInt" - unsignedInt
         * "valuePositiveInt" - positiveInt
         * "valueDecimal" - decimal
         * "valueDateTime" - dateTime
         * "valueDate" - date
         * "valueTime" - time
         * "valueInstant" - instant
         * "valueString" - string
         * "valueUri" - uri
         * "valueOid" - oid
         * "valueUuid" - uuid
         * "valueId" - id
         * "valueBoolean" - boolean
         * "valueCode" - code (only if the extension definition provides a fixed binding to a suitable set of codes)
         * "valueMarkdown" - markdown
         * "valueBase64Binary" - base64Binary
         * "valueCoding" - Coding
         * "valueCodeableConcept" - CodeableConcept
         * "valueAttachment" - Attachment
         * "valueIdentifier" - Identifier
         * "valueQuantity" - Quantity
         * "valueSampledData" - SampledData
         * "valueRange" - Range
         * "valuePeriod" - Period
         * "valueRatio" - Ratio
         * "valueHumanName" - HumanName
         * "valueAddress" - Address
         * "valueContactPoint" - ContactPoint
         * "valueTiming" - Timing
         * "valueReference" - Reference - a reference to another resource
         * "valueAnnotation" - Annotation
         * "valueSignature" - Signature
         * "valueMeta - A Meta heading from a resource
         */
        [valueX: string]: any;
    }

    interface Meta extends Element {
        
        /**
         * When the resource version last changed
         */
        lastUpdated: instant;
    }

    interface BackboneElement extends Element {
        modifierExtension ?: Extension[];
    }

    interface CapabilityStatement {
        resourceType: string;
        fhirVersion: string;
        rest: {
            security?: {
                cors?: boolean;
                extension?: {
                    url: string;
                    extension: {
                        url     : string;
                        valueUri: string;
                    }[]
                }[]
            };
            resource: {
                type: string
            }[]
        }[];
    }

    interface OperationOutcomeIssue extends BackboneElement {
        severity: issueSeverity;
        code: issueType;
        
        /**
         * Additional details about the error
         */
        details ?: CodeableConcept[];

        /**
         * Additional diagnostic information about the issue
         */
        diagnostics ?: string;

        /**
         * Path of element(s) related to issue
         */
        location ?: string[];

        /**
         * FHIRPath of element(s) related to issue
         */
        expression ?: string[];
    }

    interface Coding extends Element {
        /**
         * Identity of the terminology system
         */
        system ?: uri;

        /**
         * Version of the system - if relevant
         */
        version ?: string;

        /**
         * Symbol in syntax defined by the system
         */
        code ?: code;

        /**
         * Representation defined by the system
         */
        display ?: string;

        /**
         * If this coding was chosen directly by the user
         */
        userSelected ?: boolean;
    }

    interface CodeableConcept extends Element {
        /**
         * Code defined by a terminology system
         */
        coding?: Coding[];

        /**
         * Plain text representation of the concept
         */
        text?: string;
    }

    interface OperationOutcome extends DomainResource {

        resourceType: "OperationOutcome";

        /**
         * An error, warning or information message that results from a system action.
         */
        issue: OperationOutcomeIssue[]
    }

    interface Period extends Element {
        /**
         * Starting time with inclusive boundary
         */
        start ?: dateTime;

        /**
         * End time with inclusive boundary, if not ongoing
         */
        end ?: dateTime;
    }

    interface Reference extends Element {

        /**
         * Literal reference, Relative, internal or absolute URL
         */
        reference ?: string;
        
        /**
         * Logical reference, when literal reference is not known
         */
        identifier ?: Identifier;

        /**
         * Text alternative for the resource
         */
        display ?: string;
    }

    interface Identifier extends Element {
        use ?: "usual" | "official" | "temp" | "secondary";
        /**
         * Description of identifier
         */
        type ?: CodeableConcept;
        
        /**
         * The namespace for the identifier value
         */
        system ?: uri;

        /**
         * The value that is unique
         */
        value ?: string;

        /**
         * Time period when id is/was valid for use
         */
        period ?: Period;

        /**
         * Organization that issued id (may be just text)
         */
        assigner ?: Reference;
    }

    interface BundleLink extends BackboneElement {
        relation: string;
        url: uri;
    }

    interface BundleEntry extends BackboneElement {
        fullUrl: string; // This is optional on POSTs
        resource: Resource;
    }

    interface Bundle extends Resource {
        /**
         * Persistent identifier for the bundle
         */
        identifier ?: Identifier;

        type: "document" | "message" | "transaction" | "transaction-response"
            | "batch" | "batch-response" | "history" | "searchset" | "collection";

        total ?: unsignedInt; 

        link: BundleLink[];
        entry?: BundleEntry[];
    }
}

export namespace SMART {

    // Capabilities ------------------------------------------------------------

    type SMARTAuthenticationMethod = "client_secret_post" | "client_secret_basic";

    type launchMode = "launch-ehr" | "launch-standalone";

    type clientType = "client-public" | "client-confidential-symmetric";

    type singleSignOn = "sso-openid-connect";

    type launchContext = "context-banner" | "context-style";

    type launchContextEHR = "context-ehr-patient" | "context-ehr-encounter";

    type launchContextStandalone = "context-standalone-patient" | "context-standalone-encounter";

    type permissions = "permission-offline" | "permission-patient" | "permission-user";

    // OAuth2 Endpoints --------------------------------------------------------

    interface OAuth2Endpoints {

        /**
         * If available, URL to the OAuth2 dynamic registration endpoint for this
         * FHIR server.
         */
        register?: string;

        /**
         * URL to the OAuth2 authorization endpoint.
         */
        authorize: string;

        /**
         * URL to the OAuth2 token endpoint.
         */
        token: string;

        /**
         * If available, URL where an end-user can view which applications
         * currently have access to data and can make adjustments to these access
         * rights.
         */
        manage?: string;

        /**
         * URL to a server’s introspection endpoint that can be used to validate
         * a token.
         */
        introspect?: string;

        /**
         * URL to a server’s endpoint that can be used to revoke a token.
         */
        revoke?: string;
    }

    interface WellKnownSmartConfiguration {
        /**
         * URL to the OAuth2 authorization endpoint.
         */
        authorization_endpoint: string;
        
        /**
         * URL to the OAuth2 token endpoint.
         */
        token_endpoint: string;
        
        /**
         * If available, URL to the OAuth2 dynamic registration endpoint for the
         * FHIR server.
         */
        registration_endpoint?: string;
        
        /**
         * RECOMMENDED! URL where an end-user can view which applications currently
         * have access to data and can make adjustments to these access rights.
         */
        management_endpoint?: string;

        /**
         * RECOMMENDED! URL to a server’s introspection endpoint that can be used
         * to validate a token.
         */
        introspection_endpoint?: string;

        /**
         * RECOMMENDED! URL to a server’s revoke endpoint that can be used to
         * revoke a token.
         */
        revocation_endpoint?: string;
        
        /**
         * Array of client authentication methods supported by the token endpoint.
         * The options are “client_secret_post” and “client_secret_basic”.
         */
        token_endpoint_auth_methods?: SMARTAuthenticationMethod[];
        
        /**
         * Array of scopes a client may request.
         */
        scopes_supported?: string[];
        
        /**
         * Array of OAuth2 response_type values that are supported
         */
        response_types_supported?: string[];

        /**
         * Array of strings representing SMART capabilities (e.g., single-sign-on
         * or launch-standalone) that the server supports.
         */
        capabilities: (
            SMARTAuthenticationMethod |
            launchMode |
            clientType |
            singleSignOn |
            launchContext |
            launchContextEHR |
            launchContextStandalone |
            permissions
        )[]; 
    }

    interface IDToken {
        profile: string;
        aud: string;
        sub: string;
        iss: string;
        iat: number;
        exp: number;
        [key: string]: any;
    }

    /**
     * The response object received from the token endpoint while trying to
     * exchange the auth code for an access token. This object has a well-known
     * base structure but the auth servers are free to augment it with
     * additional properties.
     * @see http://docs.smarthealthit.org/authorization/
     */
    interface TokenResponse {

        /**
         * If present, this tells the app that it is being rendered within an
         * EHR frame and the UI outside that frame already displays the selected
         * patient's name, age, gender etc. The app can decide to hide those
         * details to prevent the UI from duplicated information.
         */
        need_patient_banner?: boolean;

        /**
         * This could be a public location of some style settings that the EHR
         * would like to suggest. The app might look it up and optionally decide
         * to apply some or all of it.
         * @see https://launch.smarthealthit.org/smart-style.json
         */
        smart_style_url?: string;

        /**
         * If you have requested that require it (like `launch` or `launch/patient`)
         * the selected patient ID will be available here.
         */
        patient?: string;

        /**
         * If you have requested that require it (like `launch` or `launch/encounter`)
         * the selected encounter ID will be available here.
         * **NOTE:** This is not widely supported as of 2018. 
         */
        encounter?: string;

        /**
         * If you have requested `openid` and `profile` scopes the profile of
         * the active user will be available as `client_id`.
         * **NOTE:** Regardless of it's name, this property does not store an ID
         * but a token that also suggests the user type like `Patient/123`,
         * `Practitioner/xyz` etc.
         */
        client_id?: string;

        /**
         * Fixed value: bearer
         */
        token_type: "bearer" | "Bearer";

        /**
         * Scope of access authorized. Note that this can be different from the
         * scopes requested by the app.
         */
        scope: string,

        /**
         * Lifetime in seconds of the access token, after which the token SHALL NOT
         * be accepted by the resource server
         */
        expires_in ?: number;

        /**
         * The access token issued by the authorization server
         */
        access_token: string;

        /**
         * Authenticated patient identity and profile, if requested
         */
        id_token ?: string;

        /**
         * Token that can be used to obtain a new access token, using the same or a
         * subset of the original authorization grants
         */
        refresh_token ?: string;

        /**
         * Other properties might be passed by the server
         */
        [key: string]: any;
    }
}
