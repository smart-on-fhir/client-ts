# Work in progress! Please do not use yet!

## Agenda and Goals

- Reduced size - The old library is 480 KB (which includes FhirJs, jQuery and node modules)
- Fully tested and maintainable
    - Continuous integration with high code coverage threshold
    - TypeScript and type definitions
    - Minimal dependencies
- Clean and simple API
    - No Babel. `tsc` is good enough for this project and produces cleaner code.
    - Use better (descriptive, intuitive) names for methods, variables and arguments.
    - Provide sourcemaps
    - Stop using the arguments polymorphism that jQuery introduced. Pass variable arguments as a map object instead.
    - Use the latest ES carefully. Unfortunately, we are targeting old browsers here and too many new features may compile to code that is too big and chunky.
- Modular architecture
    - dependencies like jQuery and FhirJs should be external and optional if possible
    - people should be free to decide what version of jQuery and FhirJs to include (if any)
    - the library should not use (depend on) the selected FhirJs adapter to make HTTP requests
    - Upon successful authorization, a client object instance should be created. That object should have one general `request` method for doing any http requests to the Fhir server. If however a FhirJs is available, it should somehow be detected and our client should make use of it...
    - Ideally, it should be easy to adopt other FHIR front-ends like FhirJS

## Random Notes

### Polyfill candidates

#### TODO: Check these to determine what needs to be poly-filled

- `Promise` - Polyfill needed! Not supported in IE, only in Edge 12+. Promises are NOT used directly by this library. They originate from the HTTP request calls. However, a global `Promise` constructor is expected to exist and is being invoked by the `__awaiter` TS helper (async functions)
- `Array.prototype.reduce` - IE10+ (probably 9+, needs testing). Polyfill if needed.
- `FormData` and `ArrayBuffer` - fixed by throwing away the jQuery adapter.
- `Uint16Array` - fixed by using HEX random strings instead of GUIDs.
- `fetch` - polyfill if needed

## Open Questions

1. What is the lower version of IE that we have to support. Currently aiming at 10.
2. What are the current EMR Browsers:
    - Cerner - IE 10+
    - Epic - ?
    - Allscripts - ?
    - Other - ?
3. The old library includes these settings:
   ```js
   replaceBrowserHistory: true,
   fullSessionStorageSupport: true
   ```
   - Why is that? Is anybody using different values for those?
   - Is anybody trying to use the library in an environment with incomplete or missing sessionStorage support? If so, is it worth trying to support that?


# API Documentation

## `SMART.authorize(options)`
Construct the authorization redirect URL and then redirects to it. If you are connecting to an open server (one that does not specify an `authorize` endpoint in its conformance statement), then this method will redirect you straight to your redirect URI. 

Note that the returned promise will either be rejected in case of error, or it will never be resolved because the page will redirect.

### options

- `serverUrl` **string** - The base URL of the Fhir server. If `iss` or `fhirServiceUrl` url parameter is passed, then thy will take precedence and this option will not be used. Otherwise, this option is required.
- `clientId` **string** - The client_id that you should have obtained while registering your app with the auth server or EHR. This is not required for open servers.
- `redirectUri` **string** - The URI to redirect to after successful authorization. This should be an absolute url and will be converted to one if it is relative. Defaults to `.`, which means the index file in the current directory.
- `scope` **string** - The access scopes that you need. Defaults to "". See http://docs.smarthealthit.org/authorization/scopes-and-launch-context/.
- `clientSecret` **string** - Your client secret if you have one (for confidential clients). Note that it is not recommended to use this option because the browsers cannot reliably keep a secret. It is implemented for testing purposes.


Examples:
```js
// Full example
// 1. If an EHR calls this as http://domain.dev/a/b/launch.html?iss=https://ehr/fhir&launch=whatever
//    you will authorize against that EHR and the serverUrl option will be ignored.
// 2. If you load it yourself, it will use http://r3.smarthealthit.org which is open and no authorization attempt will be made.
// 3. You can also launch it yourself against any server: http://domain.dev/a/b/launch.html?fhirServiceUrl=http://launch.smarthealthit.org/v/r3/fhir
// In any case you will be redirected to http://domain.dev/a/x
SMART.authorize({
    serverUrl  : "http://r3.smarthealthit.org",
    clientId   : "my-client-id",
    scope      : "launch openid profile",
    redirectUri: "../x"
}).catch(error => console.error(error));

// Typical EHR Launch
// If you are at http://domain.dev/a/b/launch.html
// The EHR will load something like http://domain.dev/a/b/launch.html?iss=https://ehr/fhir&launch=whatever
// Then you will be redirected to the EHR authorization endpoint.
SMART.authorize({
    clientId: "my-client-id",
    scope: "launch openid profile"
});

// Standalone launch
// (your serverUrl is hard-coded in your launch configuration)
SMART.authorize({
    serverUrl: "https://r3.smarthealthit.org"
});

// Standalone launch (dynamic)
// you pass fhirServiceUrl url parameter:
// http://domain.dev/a/b/launch.html?fhirServiceUrl=https://r3.smarthealthit.org
SMART.authorize();
```


### Multi-server Configuration (work in progress)
This is useful when you want to have an app that can be launched against multiple fhir servers and EHRs. It is not applicable for standalone launch scenarios but you can still inject the server url as fhirServiceUrl url parameter.
```js
SMART.authorize([
    {
        iss        : "server-1", // exact match
        clientId   : "client-id-at-server-1",
        scope      : "scopes-for-server-1",
        redirectUri: "redirect-from-server-1"
    },
    {
        iss        : /server-2/, // RegExp match
        clientId   : "client-id-at-server-2",
        scope      : "scopes-for-server-2",
        redirectUri: "redirect-from-server-2"
    },
    {
        iss        : /open-server/, // no clientId or scope is needed
        redirectUri: "my-open-server-entry-point"
    },
    {
        iss        : /test-server/, // no clientId or scope is needed
        redirectUri: "my-test-server-entry-point",
        // other stuff if needed
    }
    // ...
]);
```

## `SMART.ready()`
Completes the auth flow and resolves the returned promise with new fhir Client instance.

## `SMART.init(options)`
This is useful when you want to handle both the launch and the rest of the app
logic on the same page. It will do the following:

- If loaded for the first time, it will authorize you using `SMART.authorize(options)`. This means that you will be redirected and the current page will unload. However, you should eventually end up on the same page where `SMART.init(options)` will be called again, but it will then behave differently.
- Otherwise, if uou are being called by the EHR (code and state URL params are present), it will attempt to complete the authentication flow using `SMART.ready()` and give you a fhir client instance.
- Otherwise, it will attempt to restore previous fhir client instance.


## `Client`
The client is a fhir client instance that you obtain from `SMART.ready()` or `SMART.init()`.
Example 1 - Two pages, Promises:
```js

// launch.html
SMART.authorize({
    serverUrl: "http://launch.smarthealthit.org/v/r2/fhir",
    clientId : "whatever",
    scope    : "patient/*.* user/*.* launch openid profile offline_access"
});

// index.html
SMART.ready().then(client => {
    return client.request("/Patient")
        .then(res => res.json())
        .then(data => console.log("Patient: ", data));
})
```

Example 2 - One page, Async-await:
```ts

// index.html
async function logPatient() {
    const fhirClient = await SMART.init({
        serverUrl: "http://launch.smarthealthit.org/v/r2/fhir",
        clientId : "whatever",
        scope    : "patient/*.* user/*.* launch openid profile offline_access"
    });

    const patient = await client.request("/Patient").then(res => res.json());
            
    console.log("Patient: ", patient);
}

logPatient();
```

### Using Refresh Tokens
### Fhir.js integration

## Legacy API

FHIR.oAuth2.authorize
FHIR.oAuth2.ready
