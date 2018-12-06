/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/adapters/jquery.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/Base64/base64.js":
/*!***************************************!*\
  !*** ./node_modules/Base64/base64.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

;(function () {

  var object =
     true ? exports :
    undefined; // #31: ExtendScript

  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  function InvalidCharacterError(message) {
    this.message = message;
  }
  InvalidCharacterError.prototype = new Error;
  InvalidCharacterError.prototype.name = 'InvalidCharacterError';

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  object.btoa || (
  object.btoa = function (input) {
    var str = String(input);
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next str index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      str.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = str.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) {
        throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      block = block << 8 | charCode;
    }
    return output;
  });

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  object.atob || (
  object.atob = function (input) {
    var str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
    if (str.length % 4 == 1) {
      throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = str.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  });

}());


/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),

/***/ "./src/Client.ts":
/*!***********************!*\
  !*** ./src/Client.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var adapter_1 = __webpack_require__(/*! ./adapter */ "./src/adapter.ts");
// import makeFhir             from "fhir.js";
// import makeFhir             from "fhir.js/src/fhir.js";
// import { urlToAbsolute, getPath } from "./lib";
/**
 * A SMART Client instance will simplify some tasks for you. It will authorize
 * requests automatically, use refresh tokens, handle errors and so on.
 */
var Client = /** @class */ (function () {
    // protected fhirJs: any;
    function Client(state) {
        // This might happen if the state have been lost (for example the
        // sessionStorage has been cleared, size limit exceeded etc.).
        if (!state) {
            throw new Error("No state provided to the client");
        }
        this.state = state;
        // const accessToken = getPath(this.state, "tokenResponse.access_token");
        // this.fhirJs = makeFhir({
        //     baseUrl: state.serverUrl,
        //     auth: accessToken ?
        //         { bearer: accessToken } :
        //         {}
        // });
    }
    /**
     * Allows you to do the following:
     * 1. Use relative URLs (treat them as relative to the "serverUrl" option)
     * 2. Automatically authorize requests with your accessToken (if any)
     * 3. Automatically re-authorize using the refreshToken (if available)
     * 4. Automatically parse error operation outcomes and turn them into
     *   JavaScript Error objects with which the resulting promises are rejected
     * @param {object|string} options URL or axios request options
     */
    Client.prototype.request = function (options) {
        var cfg;
        if (typeof options == "string") {
            cfg = { url: options };
        }
        else {
            cfg = tslib_1.__assign({}, options);
        }
        cfg.url = this.state.serverUrl.replace(/\/?$/, "/") + cfg.url.replace(/^\//, "");
        // cfg.url = urlToAbsolute(cfg.url, location);
        //     // If we are talking to protected fhir server we should have an access token
        //     const accessToken = getPath(this.state, "tokenResponse.access_token");
        //     if (accessToken) {
        //         cfg.headers = {
        //             ...cfg.headers,
        //             Authorization: `Bearer ${accessToken}`
        //         };
        //     }
        return adapter_1["default"].get().http(cfg);
    };
    return Client;
}());
exports["default"] = Client;


/***/ }),

/***/ "./src/adapter.ts":
/*!************************!*\
  !*** ./src/adapter.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var adapter;
exports["default"] = {
    debug: true,
    set: function (newAdapter) {
        adapter = newAdapter;
    },
    get: function () {
        return adapter;
    }
};


/***/ }),

/***/ "./src/adapters/jquery.ts":
/*!********************************!*\
  !*** ./src/adapters/jquery.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var adapter_1 = __webpack_require__(/*! ../adapter */ "./src/adapter.ts");
__webpack_require__(/*! ../index */ "./src/index.ts");
var jquery = jQuery;
// Patch jQuery AJAX mechanism to receive blob objects via XMLHttpRequest 2. Based on:
//    https://gist.github.com/aaronk6/bff7cc600d863d31a7bf
//    http://www.artandlogic.com/blog/2013/11/jquery-ajax-blobs-and-array-buffers/
/**
 * Register ajax transports for blob send/receive and array buffer send/receive via XMLHttpRequest Level 2
 * within the comfortable framework of the jquery ajax request, with full support for promises.
 *
 * Notice the +* in the dataType string? The + indicates we want this transport to be prepended to the list
 * of potential transports (so it gets first dibs if the request passes the conditions within to provide the
 * ajax transport, preventing the standard transport from hogging the request), and the * indicates that
 * potentially any request with any dataType might want to use the transports provided herein.
 *
 * Remember to specify 'processData:false' in the ajax options when attempting to send a blob or ArrayBuffer -
 * otherwise jquery will try (and fail) to convert the blob or buffer into a query string.
 */
jQuery.ajaxTransport("+*", function (options, originalOptions, jqXHR) {
    var win = window;
    // Test for the conditions that mean we can/want to send/receive blobs or ArrayBuffers - we need XMLHttpRequest
    // level 2 (so feature-detect against window.FormData), feature detect against window.Blob or window.ArrayBuffer,
    // and then check to see if the dataType is blob/ArrayBuffer or the data itself is a Blob/ArrayBuffer
    if (win.FormData && ((options.dataType && (options.dataType === "blob" || options.dataType === "arraybuffer")) ||
        (options.data && ((win.Blob && options.data instanceof Blob) ||
            (win.ArrayBuffer && options.data instanceof ArrayBuffer))))) {
        return {
            /**
             * Return a transport capable of sending and/or receiving blobs - in this case, we instantiate
             * a new XMLHttpRequest and use it to actually perform the request, and funnel the result back
             * into the jquery complete callback (such as the success function, done blocks, etc.)
             *
             * @param headers
             * @param completeCallback
             */
            send: function (headers, completeCallback) {
                var xhr = new XMLHttpRequest(), url = options.url || win.location.href, type = options.type || "GET", dataType = options.dataType || "text", data = options.data || null, async = options.async || true;
                var key;
                xhr.addEventListener("load", function () {
                    var response = {};
                    if (xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304)) {
                        response[dataType] = xhr.response;
                    }
                    else {
                        // In case an error occurred we assume that the response body contains
                        // text data - so let's convert the binary data to a string which we can
                        // pass to the complete callback.
                        response.text = String.fromCharCode.apply(null, new Uint8Array(xhr.response));
                    }
                    completeCallback(xhr.status, xhr.statusText, response, xhr.getAllResponseHeaders());
                });
                xhr.open(type, url, async);
                xhr.responseType = dataType;
                for (key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        xhr.setRequestHeader(key, headers[key]);
                    }
                }
                xhr.send(data);
            },
            abort: function () {
                jqXHR.abort();
            }
        };
    }
});
// if (!process.browser) {
//     var windowObj = require('jsdom').jsdom().createWindow();
//     jquery = jQuery(windowObj);
// }
function defer() {
    var pr = jquery.Deferred();
    pr.promise = pr.promise();
    return pr;
}
var adapter = {
    defer: defer,
    http: function (args) {
        var ret = jquery.Deferred();
        var opts = {
            type: args.method,
            url: args.url,
            dataType: args.dataType || "json",
            headers: args.headers || {},
            data: args.data
        };
        jquery.ajax(opts)
            // .done(ret.resolve)
            // .fail(ret.reject);
            .done(function (data, status, xhr) {
            ret.resolve({
                data: data,
                status: status,
                headers: xhr.getResponseHeader,
                config: args
            });
        })
            .fail(function (err) {
            ret.reject({ error: err, data: err, config: args });
        });
        return ret.promise();
    }
};
adapter_1["default"].set(adapter);


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var oAuth2 = __webpack_require__(/*! ./oauth */ "./src/oauth.ts");
window.FHIR = {
    oAuth2: {
        settings: {
            replaceBrowserHistory: true,
            fullSessionStorageSupport: true
        },
        authorize: function (options) {
            return oAuth2.authorize(options);
        },
        ready: function () {
            return oAuth2.completeAuth();
        }
    }
};


/***/ }),

/***/ "./src/lib.ts":
/*!********************!*\
  !*** ./src/lib.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// This is the shared static library, meaning that it is simple collection of
// pure functions. It is important for these function to not have side effects
// so that the file behaves well with tree-shaking (and is fully testable).
exports.__esModule = true;
/**
 * Walks through an object (or array) and returns the value found at the
 * provided path. This function is very simple so it intentionally does not
 * support any argument polymorphism, meaning that the path can only be a
 * dot-separated string. If the path is invalid returns undefined.
 * @param {Object} obj The object (or Array) to walk through
 * @param {String} path The path (eg. "a.b.4.c")
 * @returns {*} Whatever is found in the path or undefined
 */
function getPath(obj, path) {
    if (path === void 0) { path = ""; }
    path = path.trim();
    if (!path) {
        return obj;
    }
    return path.split(".").reduce(function (out, key) { return out ? out[key] : undefined; }, obj);
}
exports.getPath = getPath;
/**
 * Get the value of the given `p` url parameter. If the parameter is used
 * multiple times the first value will be returned, unless `forceArray` is true
 * (then you get an array of values). If the parameter is not present, `null`
 * will be returned.
 * @param p The name of the parameter
 * @param options optional, default {}
 * @param options.location The base location object (defaults to the global location)
 * @param options.forceArray If true, return an array if the param is used multiple times
 */
function urlParam(p, options) {
    if (options === void 0) { options = { location: location }; }
    var loc = options.location;
    var query = loc.search.substr(1);
    var data = query.split("&");
    var result = [];
    data.forEach(function (pair) {
        var _a = pair.split("="), name = _a[0], value = _a[1];
        if (name === p) {
            result.push(decodeURIComponent(value.replace(/\+/g, "%20")));
        }
    });
    if (options.forceArray) {
        return result;
    }
    if (result.length === 0) {
        return null;
    }
    return result[0];
}
exports.urlParam = urlParam;
/**
 * If the argument string ends with a slash - remove it.
 * @param str The string to trim
 */
function stripTrailingSlash(str) {
    return String(str || "").replace(/\/+$/, "");
}
exports.stripTrailingSlash = stripTrailingSlash;
/**
 * Converts relative URL to absolute based on the given location
 * @param url The URL to convert
 * @param location The base location object
 */
function urlToAbsolute(url, doc) {
    if (doc === void 0) { doc = document; }
    var a = doc.createElement("a");
    a.setAttribute("href", url);
    return a.href;
}
exports.urlToAbsolute = urlToAbsolute;
function randomString(strLength, charSet) {
    if (strLength === void 0) { strLength = 8; }
    if (charSet === void 0) { charSet = null; }
    var result = [];
    charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789";
    var len = charSet.length;
    while (strLength--) {
        result.push(charSet.charAt(Math.floor(Math.random() * len)));
    }
    return result.join("");
}
exports.randomString = randomString;


/***/ }),

/***/ "./src/oauth.ts":
/*!**********************!*\
  !*** ./src/oauth.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var Base64_1 = __webpack_require__(/*! Base64 */ "./node_modules/Base64/base64.js");
var adapter_1 = __webpack_require__(/*! ./adapter */ "./src/adapter.ts");
var Client_1 = __webpack_require__(/*! ./Client */ "./src/Client.ts");
var lib_1 = __webpack_require__(/*! ./lib */ "./src/lib.ts");
// $lab:coverage:off$
function debug() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (sessionStorage.debug) {
        console.log.apply(console, args);
    }
}
// $lab:coverage:on$
function fetchConformanceStatement(baseUrl) {
    if (!baseUrl) {
        baseUrl = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
    }
    var url = String(baseUrl).replace(/\/*$/, "/") + "metadata";
    return adapter_1["default"].get().http({ method: "GET", url: url }).then(function (_a) {
        var data = _a.data;
        return data;
    }, function (ex) {
        debug(ex);
        throw new Error("Failed to fetch the conformance statement from \"" + url + "\"");
    });
}
exports.fetchConformanceStatement = fetchConformanceStatement;
/**
 * Given a fhir server returns an object with it's Oauth security endpoints
 * @param baseUrl Fhir server base URL
 */
function getSecurityExtensions(metadata) {
    var nsUri = "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris";
    var extensions = (lib_1.getPath(metadata || {}, "rest.0.security.extension") || [])
        .filter(function (e) { return e.url === nsUri; })
        .map(function (o) { return o.extension; })[0];
    var out = {
        registrationUri: "",
        authorizeUri: "",
        tokenUri: ""
    };
    if (extensions) {
        extensions.forEach(function (ext) {
            if (ext.url === "register") {
                out.registrationUri = ext.valueUri;
            }
            if (ext.url === "authorize") {
                out.authorizeUri = ext.valueUri;
            }
            if (ext.url === "token") {
                out.tokenUri = ext.valueUri;
            }
        });
    }
    return out;
}
exports.getSecurityExtensions = getSecurityExtensions;
/**
 * Calls the buildAuthorizeUrl function to construct the redirect URL and then
 * just redirects to it.
 */
function authorize(options, loc) {
    if (loc === void 0) { loc = location; }
    debug("Authorizing...");
    return buildAuthorizeUrl(options, loc)
        .then(function (redirect) {
        debug("Making authorize redirect to " + redirect);
        try {
            loc.href = redirect;
        }
        catch (ex) {
            throw new Error("Unable to redirect to " + redirect + ". " + ex);
        }
        return redirect;
    });
}
exports.authorize = authorize;
/**
 * First discovers the fhir server base URL from query.iis or query.fhirServiceUrl
 * or options.serverUrl. Then compiles the proper authorization URL for that server.
 * For open servers that URL is the options.redirectUri so that we can skip the
 * authorization part.
 */
function buildAuthorizeUrl(options, loc) {
    if (loc === void 0) { loc = location; }
    var launch = lib_1.urlParam("launch", { location: loc });
    var iss = lib_1.urlParam("iss", { location: loc });
    var fhirServiceUrl = lib_1.urlParam("fhirServiceUrl", { location: loc });
    var serverUrl = String(iss || fhirServiceUrl || options.serverUrl || "");
    if (iss && !launch) {
        return Promise.reject(new Error("Missing url parameter \"launch\""));
    }
    if (!serverUrl) {
        return Promise.reject(new Error("No server url found. It must be specified as query.iss or " +
            "query.fhirServiceUrl or options.serverUrl (in that order)"));
    }
    debug("Looking up the authorization endpoint for \"" + serverUrl + "\"");
    return fetchConformanceStatement(serverUrl).then(function (metadata) {
        var extensions = getSecurityExtensions(metadata);
        debug("Found security extensions: ", extensions);
        // Prepare the object that will be stored in the session
        var state = tslib_1.__assign({ serverUrl: serverUrl, clientId: options.clientId, redirectUri: lib_1.urlToAbsolute(options.redirectUri || "."), scope: options.scope || "" }, extensions);
        if (options.clientSecret) {
            debug("Adding clientSecret to the state");
            state.clientSecret = options.clientSecret;
        }
        var id = lib_1.randomString(32);
        sessionStorage.setItem(id, JSON.stringify(state));
        // sessionStorage.setItem(tokenResponse, JSON.stringify(state));
        var redirectUrl = state.redirectUri;
        // debug(state);
        if (state.authorizeUri) {
            debug("authorizeUri: " + state.authorizeUri);
            var params = [
                "response_type=code",
                "client_id=" + encodeURIComponent(state.clientId),
                "scope=" + encodeURIComponent(state.scope),
                "redirect_uri=" + encodeURIComponent(state.redirectUri),
                "aud=" + encodeURIComponent(state.serverUrl),
                "state=" + id
            ];
            // also pass this in case of EHR launch
            if (launch) {
                params.push("launch=" + encodeURIComponent(launch));
            }
            redirectUrl = state.authorizeUri + "?" + params.join("&");
        }
        return redirectUrl;
    });
}
exports.buildAuthorizeUrl = buildAuthorizeUrl;
function getState(id) {
    if (!id) {
        throw new Error("Cannot look up state by the given id (" + id + ")");
    }
    var cached = sessionStorage.getItem(id);
    if (!cached) {
        throw new Error("No state found by the given id (" + id + ")");
    }
    try {
        var json = JSON.parse(cached);
        return json;
    }
    catch (_) {
        throw new Error("Corrupt state: sessionStorage['" + id + "'] cannot be parsed as JSON.");
    }
}
exports.getState = getState;
function setState(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}
exports.setState = setState;
/**
 * Builds the token request options for axios. Does not make the request, just
 * creates it's configuration and returns it in a Promise.
 * NOTE that this function has side effects because it modifies the storage
 * contents.
 * @param req
 * @param storage
 */
function buildTokenRequest(code, state) {
    if (!state.redirectUri) {
        throw new Error("Missing state.redirectUri");
    }
    if (!state.tokenUri) {
        throw new Error("Missing state.tokenUri");
    }
    if (!state.clientId) {
        throw new Error("Missing state.clientId");
    }
    var requestOptions = {
        method: "POST",
        url: state.tokenUri,
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: {
            code: code,
            grant_type: "authorization_code",
            redirect_uri: state.redirectUri
        }
    };
    // For public apps, authentication is not possible (and thus not
    // required), since the app cannot be trusted to protect a secret.
    // For confidential apps, an Authorization header using HTTP Basic
    // authentication is required, where the username is the app’s client_id
    // and the password is the app’s client_secret
    if (state.clientSecret) {
        requestOptions.headers.Authorization = "Basic " + Base64_1.btoa(state.clientId + ":" + state.clientSecret);
        debug("Using state.clientSecret to construct the authorization header: \"" + requestOptions.headers.Authorization + "\"");
    }
    else {
        debug("No clientSecret found in state. Adding client_id to the POST body");
        requestOptions.data.client_id = state.clientId;
    }
    return requestOptions;
}
exports.buildTokenRequest = buildTokenRequest;
/**
 * After successful authorization we have received a code and state parameters.
 * Use this function to exchange that code for an access token and complete the
 * authorization flow.
 */
function completeAuth() {
    debug("Completing the code flow");
    var state = lib_1.urlParam("state");
    var code = lib_1.urlParam("code");
    var cached = getState(state);
    var requestOptions = buildTokenRequest(code, cached);
    // The EHR authorization server SHALL return a JSON structure that
    // includes an access token or a message indicating that the
    // authorization request has been denied.
    return adapter_1["default"].get().http(requestOptions)
        .then(function (_a) {
        var data = _a.data;
        debug("Received tokenResponse. Saving it to the state...");
        cached.tokenResponse = data;
        setState(state, cached);
        return new Client_1["default"](cached);
    }, function (error) {
        // TODO: handle (humanize) token error
        // console.log(error.message);
        throw error;
    });
}
exports.completeAuth = completeAuth;


/***/ })

/******/ });
//# sourceMappingURL=fhir-client.js.map