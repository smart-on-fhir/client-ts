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
- `FormData` and `ArrayBuffer` - should be fixed by throwing away the jQuery adapter.
- `Uint16Array` - fixed by using HEX random strings instead of GUIDs.

## Open Questions

1. What are the current EMR Browsers:
    - Cerner - IE 10+
    - Epic - ?
    - Allscripts - ?
    - Other - ?
2. The old library includes these settings:
   ```js
   replaceBrowserHistory: true,
   fullSessionStorageSupport: true
   ```
   - Why is that? Is anybody using different values for those?
   - Is anybody trying to use the library in an environment with incomplete or missing sessionStorage support? If so, is it worth trying to support that?
  