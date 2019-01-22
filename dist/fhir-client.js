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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

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

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var Storage_1 = __webpack_require__(/*! ./Storage */ "./src/Storage.ts");
var lib_1 = __webpack_require__(/*! ./lib */ "./src/lib.ts");
/**
 * A SMART Client instance will simplify some tasks for you. It will authorize
 * requests automatically, use refresh tokens, handle errors and so on.
 */
var Client = /** @class */ (function () {
    /**
     * Creates ne Client instance.
     * @param state Required state to initialize with.
     */
    function Client(state) {
        /**
         * The currently selected patient (if any)
         */
        this.patient = null;
        /**
         * The currently logged-in user (if any)
         */
        this.user = null;
        /**
         * The currently selected encounter (if any and if supported by the EHR)
         */
        this.encounter = null;
        // This might happen if the state have been lost (for example the
        // sessionStorage has been cleared, size limit exceeded etc.).
        if (!state) {
            throw new Error("No state provided to the client");
        }
        this.state = state;
        // Context (patient, user, encounter)
        var patientId = this.getState("tokenResponse.patient");
        var encounterId = this.getState("tokenResponse.encounter");
        var idToken = this.getState("tokenResponse.id_token");
        if (patientId) {
            this.setPatientId(patientId);
        }
        if (encounterId) {
            this.setEncounter(encounterId);
        }
        if (idToken) {
            this.parseIdToken(idToken);
        }
        // Set up Fhir.js API if "fhir" is available in the global scope
        if (typeof window.fhir == "function") {
            var accessToken = this.getState("tokenResponse.access_token");
            var auth = accessToken ?
                { type: "bearer", bearer: accessToken } :
                { type: "none" };
            this.api = window.fhir({
                baseUrl: state.serverUrl,
                auth: auth
            });
            if (this.patient) {
                this.patient.api = window.fhir({
                    baseUrl: state.serverUrl,
                    patient: patientId,
                    auth: auth
                });
            }
        }
    }
    /**
     * Parses the given id token, extracts the user information out of it and sets the current user.
     * NOTE: To reduce the size of the script we do not use any jwt library to parse the token and
     * we do not validate signatures!
     * @param idToken The ID token to parse. This must be a jwt token.
     */
    Client.prototype.parseIdToken = function (idToken) {
        try {
            var idTokenValue = JSON.parse(atob(idToken.split(".")[1]));
            var fhirUser = idTokenValue.fhirUser || idTokenValue.profile || "";
            var tokens = fhirUser.split("/");
            if (tokens.length > 1) {
                var id = tokens.pop();
                var type = tokens.pop();
                this.setUser(type, id);
            }
        }
        catch (error) {
            console.warn("Error parsing id_token:", error);
        }
    };
    /**
     * Sets the current patient
     * @param id The ID of the patient
     */
    Client.prototype.setPatientId = function (patientId) {
        var _this = this;
        this.patient = {
            id: String(patientId),
            read: function () { return _this.request("Patient/" + patientId).then(function (r) { return r.json(); }); }
        };
    };
    /**
     * Sets the current encounter
     * @param id The ID of the encounter
     */
    Client.prototype.setEncounter = function (encounterId) {
        var _this = this;
        this.encounter = {
            id: String(encounterId),
            read: function () { return _this.request("Encounter/" + encounterId).then(function (r) { return r.json(); }); }
        };
    };
    /**
     * Sets the current user
     * @param type The resource type of the user (Eg. "Patient", "Practitioner", "RelatedPerson"...)
     * @param id The ID of the user
     */
    Client.prototype.setUser = function (type, id) {
        var _this = this;
        this.user = {
            type: type,
            id: String(id),
            read: function () { return _this.request(type + "/" + id).then(function (r) { return r.json(); }); }
        };
    };
    /**
     * Gets the state, optionally diving into specific node by the given path
     * @param {string} The path to look up. Defaults to "".
     */
    Client.prototype.getState = function (path) {
        if (path === void 0) { path = ""; }
        if (!path) {
            return this.state;
        }
        return lib_1.getPath(this.state, path);
    };
    /**
     * Allows you to do the following:
     * 1. Use relative URLs (treat them as relative to the "serverUrl" option)
     * 2. Automatically authorize requests with your accessToken (if any)
     * 3. Automatically re-authorize using the refreshToken (if available)
     * 4. Automatically parse error operation outcomes and turn them into
     *    JavaScript Error objects with which the resulting promises are rejected
     * @param {string} url the URL to fetch
     * @param {object} options fetch options
     */
    Client.prototype.request = function (url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        url = lib_1.resolve(url, this.state.serverUrl);
        // If we are talking to protected fhir server we should have an access token
        var accessToken = this.getState("tokenResponse.access_token");
        if (accessToken) {
            options.headers = tslib_1.__assign({}, options.headers, { Authorization: "Bearer " + accessToken });
        }
        return fetch(url, options)
            .then(function (resp) {
            if (resp.status == 401 && _this.getState("tokenResponse.refresh_token")) {
                return _this.refresh().then(function () { return _this.request(url, options); });
            }
            return resp;
        })
            .then(lib_1.checkResponse)
            .catch(function () { return Promise.reject(new Error("Could not fetch \"" + url + "\"")); });
    };
    /**
     * Use the refresh token to obtain new access token. If the refresh token is
     * expired (or this fails for any other reason) it will be deleted from the
     * state, so that we don't enter into loops trying to re-authorize.
     */
    Client.prototype.refresh = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var refreshToken;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                refreshToken = lib_1.getPath(this.state, "tokenResponse.refresh_token");
                if (!refreshToken) {
                    throw new Error("Trying to refresh but there is no refresh token");
                }
                return [2 /*return*/, fetch(this.state.tokenUri, {
                        method: "POST",
                        headers: {
                            "content-type": "application/x-www-form-urlencoded"
                        },
                        body: "grant_type=refresh_token&refresh_token=" + encodeURIComponent(refreshToken)
                    })
                        .then(lib_1.checkResponse)
                        .then(lib_1.responseToJSON)
                        .then(function (json) {
                        _this.state.tokenResponse = tslib_1.__assign({}, _this.state.tokenResponse, json);
                        // Save this change into the sessionStorage
                        Storage_1.default.set(_this.state);
                    })
                        .catch(function (error) {
                        // debug(error);
                        // debug("Deleting the expired or invalid refresh token");
                        delete _this.state.tokenResponse.refresh_token;
                        throw error;
                    })];
            });
        });
    };
    return Client;
}());
exports.default = Client;


/***/ }),

/***/ "./src/Storage.ts":
/*!************************!*\
  !*** ./src/Storage.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var lib_1 = __webpack_require__(/*! ./lib */ "./src/lib.ts");
var KEY = "smartId";
function key() {
    return sessionStorage.getItem(KEY);
}
function getState() {
    var smartId = key();
    if (!smartId) {
        console.warn("sessionStorage[\"" + KEY + "\"] is missing or empty");
        return null;
    }
    var cached = sessionStorage.getItem(smartId);
    if (!cached) {
        console.warn("No state found by the given id (" + smartId + ")");
        return null;
    }
    try {
        return JSON.parse(cached);
    }
    catch (_) {
        console.warn("Corrupt state: sessionStorage['" + KEY + "'] cannot be parsed as JSON.");
        return null;
    }
}
exports.default = {
    key: function () { return key(); },
    get: function (path) {
        if (path === void 0) { path = ""; }
        var state = getState();
        if (path) {
            return lib_1.getPath(state || {}, path);
        }
        return state;
    },
    set: function (data) {
        sessionStorage.setItem(key(), JSON.stringify(data));
    },
    extend: function (data) {
        var state = getState() || {};
        sessionStorage.setItem(key(), JSON.stringify(tslib_1.__assign({}, state, data)));
    },
    clear: function () {
        sessionStorage.removeItem(key());
    }
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// import "whatwg-fetch";
var oAuth2 = __webpack_require__(/*! ./oauth */ "./src/oauth.ts");
// New API ---------------------------------------------------------------------
exports.SMART = {
    /**
     * Starts the authorization flow (redirects to the auth uri). This should be
     * called on the page that represents your launch_uri.
     * @param options
     */
    authorize: function (options) {
        return oAuth2.authorize(options);
    },
    /**
     * Completes the authorization flow. This should be called on the page that
     * represents your redirect_uri.
     */
    // ready: oAuth2.ready,
    /**
     * Calls `authorize` or `ready` depending on the URL parameters. Can be used
     * to handle everything in one page (when the launch_uri and redirect_uri of
     * your smart client are the same)
     */
    init: oAuth2.init
};
// Legacy API ------------------------------------------------------------------
exports.FHIR = {
    oAuth2: {
        settings: {
            replaceBrowserHistory: true,
            fullSessionStorageSupport: true
        },
        authorize: function (options) {
            return oAuth2.authorize(options);
        },
    }
};
if (typeof window !== "undefined") {
    window.SMART = exports.SMART;
    window.FHIR = exports.FHIR;
}


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
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
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
/**
 * This is similar to the `urlToAbsolute` function but you can pass the domain
 * serverUrl. It is used to convert relative URIs to absolute ones.
 * @param path The path to convert to absolute. If it begins with "http" or
 * "urn", it will be returned as is.
 * @param serverUrl The base URL of the resulting url. If empty, the current
 * document URL will be used. Defaults to "".
 */
function resolve(path, serverUrl) {
    if (serverUrl === void 0) { serverUrl = ""; }
    if (path.match(/^(http|urn)/))
        return path;
    if (!serverUrl)
        return urlToAbsolute(path);
    return [
        serverUrl.replace(/\/$\s*/, ""),
        path.replace(/^\s*\//, "")
    ].join("/");
}
exports.resolve = resolve;
/**
 * Generates random strings. By default this returns random 8 characters long
 * alphanumeric strings.
 * @param strLength The length of the output string. Defaults to 8.
 * @param charSet A string containing all the possible characters. Defaults to
 * all the upper and lower-case letters plus digits.
 */
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
/**
 * Used in fetch Promise chains to reject if the "ok" property is not true
 */
function checkResponse(resp) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!resp.ok) return [3 /*break*/, 2];
                    return [4 /*yield*/, humanizeError(resp)];
                case 1: throw (_a.sent());
                case 2: return [2 /*return*/, resp];
            }
        });
    });
}
exports.checkResponse = checkResponse;
/**
 * Used in fetch Promise chains to return the JSON bersion of the response
 */
function responseToJSON(resp) {
    return resp.json();
}
exports.responseToJSON = responseToJSON;
function humanizeError(resp) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var msg, json, _1, text, _2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    msg = resp.status + " " + resp.statusText;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 8]);
                    return [4 /*yield*/, resp.json()];
                case 2:
                    json = _a.sent();
                    if (json.error) {
                        msg += "\n" + json.error;
                        if (json.error_description) {
                            msg += ": " + json.error_description;
                        }
                    }
                    else {
                        msg += "\n" + json;
                    }
                    return [3 /*break*/, 8];
                case 3:
                    _1 = _a.sent();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, resp.text()];
                case 5:
                    text = _a.sent();
                    if (text) {
                        msg += "\n" + text;
                    }
                    return [3 /*break*/, 7];
                case 6:
                    _2 = _a.sent();
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 8];
                case 8: 
                // msg += "\nURL: " + resp.url;
                throw new Error(msg);
            }
        });
    });
}
exports.humanizeError = humanizeError;
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
exports.debug = debug;
// $lab:coverage:on$


/***/ }),

/***/ "./src/oauth.ts":
/*!**********************!*\
  !*** ./src/oauth.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var Client_1 = __webpack_require__(/*! ./Client */ "./src/Client.ts");
var Storage_1 = __webpack_require__(/*! ./Storage */ "./src/Storage.ts");
var lib_1 = __webpack_require__(/*! ./lib */ "./src/lib.ts");
function fetchConformanceStatement(baseUrl) {
    if (!baseUrl) {
        baseUrl = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
    }
    var url = String(baseUrl).replace(/\/*$/, "/") + "metadata";
    return fetch(url)
        .then(lib_1.checkResponse)
        .then(function (resp) { return resp.json(); })
        .catch(function (ex) {
        lib_1.debug(ex);
        throw new Error("Failed to fetch the conformance statement from \"" + url + "\". " + ex);
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
 * just redirects to it. Note that the returned promise will either be rejected
 * in case of error, or it will never be resolved because the page wil redirect.
 */
function authorize(options, loc) {
    if (options === void 0) { options = {}; }
    if (loc === void 0) { loc = location; }
    return buildAuthorizeUrl(options, loc).then(function (redirect) {
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
 *
 * The following flows are possible:
 * 1. EHR Launch        - pass "iss" and "launch" URL params
 * 2. Standalone Launch - pass "serverUrl" as option
 * 3. Test Launch       - pass "serverUrl" as URL param (takes precedence over #2)
 */
function buildAuthorizeUrl(options, loc) {
    if (options === void 0) { options = {}; }
    if (loc === void 0) { loc = location; }
    var iss = lib_1.urlParam("iss", { location: loc }) || "";
    var fhirServiceUrl = lib_1.urlParam("fhirServiceUrl", { location: loc }) || "";
    var cfg;
    var serverUrl = String(iss || fhirServiceUrl || "");
    if (Array.isArray(options)) {
        cfg = options.find(function (o) {
            if (typeof o.iss == "string") {
                return o.iss === iss || o.iss === fhirServiceUrl;
            }
            if (o.iss instanceof RegExp) {
                return (iss && o.iss.test(iss)) ||
                    (fhirServiceUrl && o.iss.test(fhirServiceUrl));
            }
        });
        if (!cfg) {
            return Promise.reject(new Error("None of the provided configurations matched the current server \"" + serverUrl + "\""));
        }
    }
    else {
        cfg = options;
        if (!serverUrl) {
            serverUrl = String(cfg.serverUrl || "");
        }
    }
    var launch = lib_1.urlParam("launch", { location: loc });
    if (iss && !launch) {
        return Promise.reject(new Error("Missing url parameter \"launch\""));
    }
    if (!serverUrl) {
        return Promise.reject(new Error("No server url found. It must be specified as query.iss or " +
            "query.fhirServiceUrl or options.serverUrl (in that order)"));
    }
    lib_1.debug("Looking up the authorization endpoint for \"" + serverUrl + "\"");
    return fetchConformanceStatement(serverUrl).then(function (metadata) {
        var extensions = getSecurityExtensions(metadata);
        // Prepare the object that will be stored in the session
        var state = tslib_1.__assign({ serverUrl: serverUrl, clientId: cfg.clientId, redirectUri: lib_1.urlToAbsolute(cfg.redirectUri || "."), scope: cfg.scope || "" }, extensions);
        if (cfg.clientSecret) {
            state.clientSecret = cfg.clientSecret;
        }
        // Create an unique key and use it to store the state
        var id = lib_1.randomString(32);
        sessionStorage.setItem(id, JSON.stringify(state));
        // In addition, save the random key to a well-known location. This way
        // the page knows how to find it after reload and restore it's client
        // state from there.
        sessionStorage.setItem("smartId", id);
        var redirectUrl = state.redirectUri;
        if (state.authorizeUri) {
            if (!cfg.clientId) {
                throw new Error("A \"clientId\" option is required by this server");
            }
            lib_1.debug("authorizeUri: " + state.authorizeUri);
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
        // url   : state.tokenUri,
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body: "code=" + code + "&grant_type=authorization_code&redirect_uri=" + encodeURIComponent(state.redirectUri)
    };
    // For public apps, authentication is not possible (and thus not required),
    // since a client with no secret cannot prove its identity when it issues a
    // call. (The end-to-end system can still be secure because the client comes
    // from a known, https protected endpoint specified and enforced by the
    // redirect uri.) For confidential apps, an Authorization header using HTTP
    // Basic authentication is required, where the username is the app’s
    // client_id and the password is the app’s client_secret (see example).
    if (state.clientSecret) {
        requestOptions.headers.Authorization = "Basic " + btoa(state.clientId + ":" + state.clientSecret);
        lib_1.debug("Using state.clientSecret to construct the authorization header: \"" + requestOptions.headers.Authorization + "\"");
    }
    else {
        lib_1.debug("No clientSecret found in state. Adding client_id to the POST body");
        // requestOptions.data.client_id = state.clientId;
        requestOptions.body += "&client_id=" + encodeURIComponent(state.clientId);
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
    lib_1.debug("Completing the code flow");
    // These are coming from the URL so make sure we validate them
    var state = lib_1.urlParam("state");
    var code = lib_1.urlParam("code");
    // if (!state) throw new Error('No "state" parameter found in the URL');
    // if (!code ) throw new Error('No "code" parameter found in the URL' );
    // Remove the `code` and `state` params from the URL so that if the page is
    // reloaded it won't have to re-authorize
    if (window.history.replaceState) {
        window.history.replaceState({}, "", location.href.replace(location.search, ""));
    }
    // We have received a `state` param that should be the sessionStorage key
    // in which we store our state. But what if somebody passes `state` param
    // manually and trick us to store the state on different location?
    if (Storage_1.default.key() !== state) {
        return Promise.reject(new Error("State key mismatch. Expected \"" + state + "\" but found \"" + Storage_1.default.key() + "\"."));
    }
    var cached = Storage_1.default.get();
    // state and code are coming from the page url so they might be empty or
    // just invalid. In this case buildTokenRequest() will throw!
    var requestOptions = buildTokenRequest(code, cached);
    // The EHR authorization server SHALL return a JSON structure that
    // includes an access token or a message indicating that the
    // authorization request has been denied.
    return fetch(cached.tokenUri, requestOptions)
        .then(lib_1.checkResponse)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {
        lib_1.debug("Received tokenResponse. Saving it to the state...");
        cached.tokenResponse = data;
        Storage_1.default.set(cached);
        return cached;
    })
        .then(function (stored) { return waitForDomReady(stored); })
        .then(function (stored) { return new Client_1.default(stored); });
}
exports.completeAuth = completeAuth;
function init(options) {
    // if `code` and `state` params are present we need to complete the auth flow
    if (lib_1.urlParam("state") && lib_1.urlParam("code")) {
        return completeAuth();
    }
    // Check for existing client state. If state is found, it means a client
    // instance have already been created in this session and we should try to
    // "revive" it.
    var cached = Storage_1.default.get();
    if (cached) {
        return Promise.resolve(new Client_1.default(cached));
    }
    // Otherwise try to launch
    authorize(options).then(function () {
        // `init` promises a Client but that cannot happen in this case. The
        // browser will be redirected (unload the page and be redirected back
        // to it later and the same init function will be called again). On
        // success, authorize will resolve with the redirect url but we don't
        // want to return that from this promise chain because it is not a
        // Client instance. At the same time, if authorize fails, we do want to
        // pass the error to those waiting for a client instance.
        return new Promise(function () { });
    });
}
exports.init = init;
// export async function ready(): Promise<Client> {
//     // First check for existing client state
//     const cached = getState("smart");
//     // If state is found, it means a client instance have already been created
//     // in this session and we should try to revive it.
//     if (cached) {
//         return new Client(cached);
//     }
//     // If no state is found we should be visiting this page for the first time
//     const state = urlParam("state");
//     const code  = urlParam("code");
//     // if `code` and `state` params are present we need to complete the auth flow
//     if (state && code) {
//         return completeAuth();
//     }
//     throw new Error("Unable to complete authentication. Please re-launch the application");
// }
function waitForDomReady() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new Promise(function (resolve) {
        if (document.readyState == "complete") {
            resolve.apply(void 0, args);
        }
        else {
            setTimeout(function () { return waitForDomReady.apply(void 0, args); }, 100);
        }
    });
}


/***/ })

/******/ });
//# sourceMappingURL=fhir-client.js.map