# Work in progress! Please do not use yet!

## Agenda

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
