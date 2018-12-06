### Polyfill candidates
TODO: Check these to determine what needs to be polyfilled

- `Promise` - Polyfill needed! Not supported in IE, only in Edge 12+. Promises are NOT used directly by this library. They originate from the HTTP request calls. However, a global `Promise` constructor is expected to exist and is being invoked by the `__awaiter` TS helper (async functions)
- `Array.prototype.reduce` - IE10+ (probably 9+, needs testing). Polyfill if needed.
- `FormData` and `ArrayBuffer` - should be fixed by throwing away the jQuery adapter.
- `Uint16Array` - fixed by using HEX random strings instead of GUIDs.

EMR Browsers:
- Cerner - IE 10+
- Epic - ?
- Allscripts - ?
- Other - ?

