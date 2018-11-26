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

/***/ "./node_modules/fhir.js/node_modules/Base64/base64.js":
/*!************************************************************!*\
  !*** ./node_modules/fhir.js/node_modules/Base64/base64.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

;(function () {

  var object =  true ? exports : undefined; // #8: web workers
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
    var str = String(input).replace(/=+$/, '');
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

/***/ "./node_modules/fhir.js/src/decorate.js":
/*!**********************************************!*\
  !*** ./node_modules/fhir.js/src/decorate.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() {
    var fhirAPI;
    var adapter;

    function getNext (bundle, process) {
        var i;
        var d = bundle.data.entry || [];
        var entries = [];
        for (i = 0; i < d.length; i++) {
            entries.push(d[i].resource);
        }
        process(entries);
        var def = adapter.defer();
        fhirAPI.nextPage({bundle:bundle.data}).then(function (r) {
            getNext(r, process).then(function (t) {
                def.resolve();
            });
        }, function(err) {def.resolve()});
        return def.promise;
    }
    
    function drain (searchParams, process, done, fail) {
        var ret = adapter.defer();
        
        fhirAPI.search(searchParams).then(function(data){
            getNext(data, process).then(function() {
                done();
            }, function(err) {
                fail(err);
            });
        }, function(err) {
            fail(err);
        });
    };
    
    function fetchAll (searchParams){
        var ret = adapter.defer();
        var results = [];
        
        drain(
            searchParams,
            function(entries) {
                entries.forEach(function(entry) {
                    results.push(entry);
                });
            },
            function () {
                ret.resolve(results);
            },
            function (err) {
                ret.reject(err);
            }
        );
          
        return ret.promise;
    };

    function fetchAllWithReferences (searchParams, resolveParams) {
        var ret = adapter.defer();
          
        fhirAPI.search(searchParams)  // TODO: THIS IS NOT CORRECT (need fetchAll, but it does not return a bundle yet)
            .then(function(results){

                var resolvedReferences = {};

                var queue = [function() {ret.resolve(results, resolvedReferences);}];
                
                function enqueue (bundle,resource,reference) {
                  queue.push(function() {resolveReference(bundle,resource,reference)});
                }

                function next() {
                  (queue.pop())();
                }

                function resolveReference (bundle,resource,reference) {
                    var referenceID = reference.reference;
                    fhirAPI.resolve({'bundle': bundle, 'resource': resource, 'reference':reference}).then(function(res){
                      var referencedObject = res.data || res.content;
                      resolvedReferences[referenceID] = referencedObject;
                      next();
                    });
                }

                var bundle = results.data;

                bundle.entry && bundle.entry.forEach(function(element){
                  var resource = element.resource;
                  var type = resource.resourceType;
                  resolveParams && resolveParams.forEach(function(resolveParam){
                    var param = resolveParam.split('.');
                    var targetType = param[0];
                    var targetElement = param[1];
                    var reference = resource[targetElement];
                    if (type === targetType && reference) {
                      var referenceID = reference.reference;
                      if (!resolvedReferences[referenceID]) {
                        enqueue(bundle,resource,reference);
                      }
                    }
                  });
                });

                next();

            }, function(){
                ret.reject("Could not fetch search results");
            });
          
        return ret.promise;
    };
    
    function decorate (client, newAdapter) {
        fhirAPI = client;
        adapter = newAdapter;
        client["drain"] = drain;
        client["fetchAll"] = fetchAll;
        client["fetchAllWithReferences"] = fetchAllWithReferences;
        return client;
    }
    
    module.exports = decorate;
}).call(this);

/***/ }),

/***/ "./node_modules/fhir.js/src/fhir.js":
/*!******************************************!*\
  !*** ./node_modules/fhir.js/src/fhir.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function() {
    var utils = __webpack_require__(/*! ./utils */ "./node_modules/fhir.js/src/utils.js");
    var M = __webpack_require__(/*! ./middlewares/core */ "./node_modules/fhir.js/src/middlewares/core.js");
    var query = __webpack_require__(/*! ./middlewares/search */ "./node_modules/fhir.js/src/middlewares/search.js");
    var auth = __webpack_require__(/*! ./middlewares/auth */ "./node_modules/fhir.js/src/middlewares/auth.js");
    var transport = __webpack_require__(/*! ./middlewares/http */ "./node_modules/fhir.js/src/middlewares/http.js");
    var errors = __webpack_require__(/*! ./middlewares/errors */ "./node_modules/fhir.js/src/middlewares/errors.js");
    var config = __webpack_require__(/*! ./middlewares/config */ "./node_modules/fhir.js/src/middlewares/config.js");
    var bundle = __webpack_require__(/*! ./middlewares/bundle */ "./node_modules/fhir.js/src/middlewares/bundle.js");
    var pt = __webpack_require__(/*! ./middlewares/patient */ "./node_modules/fhir.js/src/middlewares/patient.js");
    var refs = __webpack_require__(/*! ./middlewares/references */ "./node_modules/fhir.js/src/middlewares/references.js");
    var url = __webpack_require__(/*! ./middlewares/url */ "./node_modules/fhir.js/src/middlewares/url.js");
    var decorate = __webpack_require__(/*! ./decorate */ "./node_modules/fhir.js/src/decorate.js");

    var cache = {};


    var fhir = function(cfg, adapter){
        var Middleware = M.Middleware;
        var $$Attr = M.$$Attr;

        var $$Method = function(m){ return $$Attr('method', m);};
        var $$Header = function(h,v) {return $$Attr('headers.' + h, v);};

        var $Errors = Middleware(errors);
        var Defaults = Middleware(config(cfg, adapter))
                .and($Errors)
                .and(auth.$Basic)
                .and(auth.$Bearer)
                .and(auth.$Credentials)
                .and(transport.$JsonData)
                .and($$Header('Accept', (cfg.headers && cfg.headers['Accept']) ? cfg.headers['Accept'] : 'application/json'))
                .and($$Header('Content-Type', (cfg.headers && cfg.headers['Content-Type']) ? cfg.headers['Content-Type'] : 'application/json'));

        var GET = Defaults.and($$Method('GET'));
        var POST = Defaults.and($$Method('POST'));
        var PUT = Defaults.and($$Method('PUT'));
        var DELETE = Defaults.and($$Method('DELETE'));

        var http = transport.Http(cfg, adapter);

        var Path = url.Path;
        var BaseUrl = Path(cfg.baseUrl);
        var resourceTypePath = BaseUrl.slash(":type || :resource.resourceType");
        var searchPath = resourceTypePath;
        var resourceTypeHxPath = resourceTypePath.slash("_history");
        var resourcePath = resourceTypePath.slash(":id || :resource.id");
        var resourceHxPath = resourcePath.slash("_history");
        var vreadPath =  resourceHxPath.slash(":versionId || :resource.meta.versionId");
        var resourceVersionPath = resourceHxPath.slash(":versionId || :resource.meta.versionId");

        var ReturnHeader = $$Header('Prefer', 'return=representation');

        var $Paging = Middleware(query.$Paging);

        return decorate({
            conformance: GET.and(BaseUrl.slash("metadata")).end(http),
            document: POST.and(BaseUrl.slash("Document")).end(http),
            profile:  GET.and(BaseUrl.slash("Profile").slash(":type")).end(http),
            transaction: POST.and(BaseUrl).end(http),
            history: GET.and(BaseUrl.slash("_history")).and($Paging).end(http),
            typeHistory: GET.and(resourceTypeHxPath).and($Paging).end(http),
            resourceHistory: GET.and(resourceHxPath).and($Paging).end(http),
            read: GET.and(pt.$WithPatient).and(resourcePath).end(http),
            vread: GET.and(vreadPath).end(http),
            "delete": DELETE.and(resourcePath).and(ReturnHeader).end(http),
            create: POST.and(resourceTypePath).and(ReturnHeader).end(http),
            validate: POST.and(resourceTypePath.slash("_validate")).end(http),
            search: GET.and(resourceTypePath).and(pt.$WithPatient).and(query.$SearchParams).and($Paging).end(http),
            update: PUT.and(resourcePath).and(ReturnHeader).end(http),
            nextPage: GET.and(bundle.$$BundleLinkUrl("next")).end(http),
            prevPage: GET.and(bundle.$$BundleLinkUrl("prev")).end(http),
            resolve: GET.and(refs.resolve).end(http)
        }, adapter);

    };
    module.exports = fhir;
}).call(this);


/***/ }),

/***/ "./node_modules/fhir.js/src/middlewares/auth.js":
/*!******************************************************!*\
  !*** ./node_modules/fhir.js/src/middlewares/auth.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function() {
    var mw = __webpack_require__(/*! ./core */ "./node_modules/fhir.js/src/middlewares/core.js");

    var btoa = __webpack_require__(/*! Base64 */ "./node_modules/fhir.js/node_modules/Base64/base64.js").btoa;

    exports.$Basic = mw.$$Attr('headers.Authorization', function(args){
        if(args.auth && args.auth.user && args.auth.pass){
            return "Basic " + btoa(args.auth.user + ":" + args.auth.pass);
        }
    });

    exports.$Bearer = mw.$$Attr('headers.Authorization', function(args){
        if(args.auth && args.auth.bearer){
            return "Bearer " + args.auth.bearer;
        }
    });

    var credentials;
    // this first middleware sets the credentials attribute to empty, so
    // adapters cannot use it directly, thus enforcing a valid value to be parsed in.
    exports.$Credentials = mw.Middleware(mw.$$Attr('credentials', function(args){
      // Assign value for later checking
      credentials = args.credentials

      // Needs to return non-null and not-undefined
      // in order for value to be (un)set
      return '';
    })).and(mw.$$Attr('credentials', function(args){
        // check credentials for valid options, valid for fetch
        if(['same-origin', 'include'].indexOf(credentials) > -1 ){
            return credentials;
        }
    }));

}).call(this);


/***/ }),

/***/ "./node_modules/fhir.js/src/middlewares/bundle.js":
/*!********************************************************!*\
  !*** ./node_modules/fhir.js/src/middlewares/bundle.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.$$BundleLinkUrl =  function(rel){
    return function(h) {
        return function(args){
            var matched = function(x){return x.relation && x.relation === rel;};
            var res =  args.bundle && (args.bundle.link || []).filter(matched)[0];
            if(res && res.url){
                args.url = res.url;
                args.data = null;
                return h(args);
            }
            else{
                throw new Error("No " + rel + " link found in bundle");
            }
        };
    };
};


/***/ }),

/***/ "./node_modules/fhir.js/src/middlewares/config.js":
/*!********************************************************!*\
  !*** ./node_modules/fhir.js/src/middlewares/config.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() {
    var copyAttr = function(from, to, attr){
        var v =  from[attr];
        if(v && !to[attr]) {to[attr] = v;}
        return from;
    };

    module.exports = function(cfg, adapter){
        return function(h){
            return function(args){
                copyAttr(cfg, args, 'baseUrl');
                copyAttr(cfg, args, 'cache');
                copyAttr(cfg, args, 'auth');
                copyAttr(cfg, args, 'patient');
                copyAttr(cfg, args, 'debug');
                copyAttr(cfg, args, 'credentials');
                copyAttr(cfg, args, 'headers');
                copyAttr(cfg, args, 'agentOptions');
                copyAttr(adapter, args, 'defer');
                copyAttr(adapter, args, 'http');
                return h(args);
            };
        };
    };
}).call(this);


/***/ }),

/***/ "./node_modules/fhir.js/src/middlewares/core.js":
/*!******************************************************!*\
  !*** ./node_modules/fhir.js/src/middlewares/core.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function() {
    var utils = __webpack_require__(/*! ../utils */ "./node_modules/fhir.js/src/utils.js");

    var id = function(x){return x;};
    var constantly = function(x){return function(){return x;};};

    var mwComposition = function(mw1, mw2){
        return function(h){ return mw1(mw2(h)); };
    };

    var Middleware = function(mw){
        mw.and = function(nmw){
            return Middleware(mwComposition(mw, nmw));
        };
        mw.end = function(h){
            return mw(h);
        };
        return mw;
    };

    // generate wm from function
    exports.$$Simple = function(f){
        return function(h){
            return function(args){
                return h(f(args));
            };
        };
    };

    var setAttr = function(args, attr, value){
        var path = attr.split('.');
        var obj = args;
        for(var i = 0; i < (path.length - 1); i++){
            var k = path[i];
            obj = args[k];
            if(!obj){
                obj = {};
                args[k] = obj;
            }
        }
        obj[path[path.length - 1]] = value;
        return args;
    };

    // generate wm from function
    exports.$$Attr = function(attr, fn){
        return Middleware(function(h){
            return function(args) {
                var value = null;
                if(utils.type(fn) == 'function'){
                   value = fn(args);
                } else {
                    value = fn;
                }
                if(value == null && value == undefined){
                    return h(args);
                }else {
                    return h(setAttr(args, attr, value));
                }
            };
        });
    };

    var Attribute = function(attr, fn){
        return Middleware(function(h){
            return function(args) {
                args[attr] = fn(args);
                return h(args);
            };
        });
    };

    var Method = function(method){
        return Attribute('method', constantly(method));
    };

    exports.Middleware = Middleware;
    exports.Attribute = Attribute;
    exports.Method = Method;

}).call(this);


/***/ }),

/***/ "./node_modules/fhir.js/src/middlewares/errors.js":
/*!********************************************************!*\
  !*** ./node_modules/fhir.js/src/middlewares/errors.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(h){
    return function(args){
        try{
            return h(args);
        }catch(e){
            if(args.debug){
               console.log("\nDEBUG: (ERROR in middleware)");
               console.log(e.message);
               console.log(e.stack);
            }
            if(!args.defer) {
                console.log("\nDEBUG: (ERROR in middleware)");
                console.log(e.message);
                console.log(e.stack);
                throw new Error("I need adapter.defer");
            }
            var deff = args.defer();
            deff.reject(e);
            return deff.promise;
        }
    };
};


/***/ }),

/***/ "./node_modules/fhir.js/src/middlewares/http.js":
/*!******************************************************!*\
  !*** ./node_modules/fhir.js/src/middlewares/http.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function() {
    var utils = __webpack_require__(/*! ../utils */ "./node_modules/fhir.js/src/utils.js");

    exports.Http = function(cfg, adapter){
        return function(args){
            if(args.debug){
                console.log("\nDEBUG (request):", args.method, args.url, args);
            }
            var promise = (args.http || adapter.http  || cfg.http)(args);
            if (args.debug && promise && promise.then){
                promise.then(function(x){ console.log("\nDEBUG: (responce)", x);});
            }
            return promise;
        };
    };

    var toJson = function(x){
        return (utils.type(x) == 'object') ? JSON.stringify(x) : x;
    };

    exports.$JsonData = function(h){
        return function(args){
            var data = args.bundle || args.data || args.resource;
            if(data){
                args.data = toJson(data);
            }
            return h(args);
        };
    };

}).call(this);


/***/ }),

/***/ "./node_modules/fhir.js/src/middlewares/patient.js":
/*!*********************************************************!*\
  !*** ./node_modules/fhir.js/src/middlewares/patient.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function() {
    var mw = __webpack_require__(/*! ./core */ "./node_modules/fhir.js/src/middlewares/core.js");

    // List of resources with 'patient' or 'subject' properties (as of FHIR DSTU2 1.0.0)
    var targets = [
        "Account",
        "AllergyIntolerance",
        "BodySite",
        "CarePlan",
        "Claim",
        "ClinicalImpression",
        "Communication",
        "CommunicationRequest",
        "Composition",
        "Condition",
        "Contract",
        "DetectedIssue",
        "Device",
        "DeviceUseRequest",
        "DeviceUseStatement",
        "DiagnosticOrder",
        "DiagnosticReport",
        "DocumentManifest",
        "DocumentReference",
        "Encounter",
        "EnrollmentRequest",
        "EpisodeOfCare",
        "FamilyMemberHistory",
        "Flag",
        "Goal",
        "ImagingObjectSelection",
        "ImagingStudy",
        "Immunization",
        "ImmunizationRecommendation",
        "List",
        "Media",
        "MedicationAdministration",
        "MedicationDispense",
        "MedicationOrder",
        "MedicationStatement",
        "NutritionOrder",
        "Observation",
        "Order",
        "Procedure",
        "ProcedureRequest",
        "QuestionnaireResponse",
        "ReferralRequest",
        "RelatedPerson",
        "RiskAssessment",
        "Specimen",
        "SupplyDelivery",
        "SupplyRequest",
        "VisionPrescription"
    ];

    exports.$WithPatient = mw.$$Simple(function(args){
        var type = args.type;
        if (args.patient) {
            if (type === "Patient") {
                args.query = args.query || {};
                args.query["_id"] = args.patient;
                args["id"] = args.patient;
            } else if (targets.indexOf(type) >= 0){
                args.query = args.query || {};
                args.query["patient"] = args.patient;
            }
        }
        return args;
    });
}).call(this);


/***/ }),

/***/ "./node_modules/fhir.js/src/middlewares/references.js":
/*!************************************************************!*\
  !*** ./node_modules/fhir.js/src/middlewares/references.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function() {
    var utils = __webpack_require__(/*! ../utils */ "./node_modules/fhir.js/src/utils.js");

    var CONTAINED = /^#(.*)/;
    var resolveContained = function(ref, resource) {
        var cid = ref.match(CONTAINED)[1];
        var ret = (resource.contained || []).filter(function(r){
            return (r.id || r._id) == cid;
        })[0];
        return (ret && {content: ret}) || null;
    };

    var sync = function(arg) {
        var cache = arg.cache;
        var reference = arg.reference;
        var bundle = arg.bundle;
        var ref = reference;
        if (!ref.reference) {return null;}
        if (ref.reference.match(CONTAINED)) {return resolveContained(ref.reference, arg.resource);}
        var abs = utils.absoluteUrl(arg.baseUrl, ref.reference);
        var bundled = ((bundle && bundle.entry) || []).filter( function(e){
            return e.id === abs;
        })[0];
        return bundled || (cache != null ? cache[abs] : void 0) || null;
    };

    var resolve = function(h){
        return function(args) {
            var cacheMatched = sync(args);
            var ref = args.reference;
            var def = args.defer();
            if (cacheMatched) {
                if(!args.defer){ throw new Error("I need promise constructor 'adapter.defer' in adapter"); }
                def.resolve(cacheMatched);
                return def.promise;
            }
            if (!ref) {
                throw new Error("No reference found");
            }
            if (ref && ref.reference.match(CONTAINED)) {
                throw new Error("Contained resource not found");
            }
            args.url = utils.absoluteUrl(args.baseUrl, ref.reference);
            args.data = null;
            return h(args);
        };
    };

    module.exports.sync = sync;
    module.exports.resolve = resolve;

}).call(this);


/***/ }),

/***/ "./node_modules/fhir.js/src/middlewares/search.js":
/*!********************************************************!*\
  !*** ./node_modules/fhir.js/src/middlewares/search.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function() {
    var utils = __webpack_require__(/*! ../utils */ "./node_modules/fhir.js/src/utils.js");

    var type = utils.type;

    var assertArray = utils.assertArray;

    var assertObject = utils.assertObject;

    var reduceMap = utils.reduceMap;

    var identity = utils.identity;

    var OPERATORS = {
        $gt: 'gt',
        $lt: 'lt',
        $lte: 'lte',
        $gte: 'gte'
    };

    var MODIFIERS = {
        $asc: ':asc',
        $desc: ':desc',
        $exact: ':exact',
        $missing: ':missing',
        $null: ':missing',
        $text: ':text'
    };

    var isOperator = function(v) {
        return v.indexOf('$') === 0;
    };

    var expandParam = function(k, v) {
        return reduceMap(v, function(acc, arg) {
            var kk, o, res, vv;
            kk = arg[0], vv = arg[1];
            return acc.concat(kk === '$and' ? assertArray(vv).reduce((function(a, vvv) {
                return a.concat(linearizeOne(k, vvv));
            }), []) : kk === '$type' ? [] : isOperator(kk) ? (o = {
                param: k
            }, kk === '$or' ? o.value = vv : (OPERATORS[kk] ? o.operator = OPERATORS[kk] : void 0, MODIFIERS[kk] ? o.modifier = MODIFIERS[kk] : void 0, type(vv) === 'object' && vv.$or ? o.value = vv.$or : o.value = [vv]), [o]) : (v.$type ? res = ":" + v.$type : void 0, linearizeOne("" + k + (res || '') + "." + kk, vv)));
        });
    };

    var handleSort = function(xs) {
        var i, len, results, x;
        assertArray(xs);
        results = [];
        for (i = 0, len = xs.length; i < len; i++) {
            x = xs[i];
            switch (type(x)) {
            case 'array':
                results.push({
                    param: '_sort',
                    value: x[0],
                    modifier: ":" + x[1]
                });
                break;
            case 'string':
                results.push({
                    param: '_sort',
                    value: x
                });
                break;
            default:
                results.push(void 0);
            }
        }
        return results;
    };

    var handleInclude = function(includes) {
        return reduceMap(includes, function(acc, arg) {
            var k, v;
            k = arg[0], v = arg[1];
            return acc.concat((function() {
                switch (type(v)) {
                case 'array':
                    return v.map(function(x) {
                        return {
                            param: '_include',
                            value: k + "." + x
                        };
                    });
                case 'string':
                    return [
                        {
                            param: '_include',
                            value: k + "." + v
                        }
                    ];
                }
            })());
        });
    };

    var linearizeOne = function(k, v) {
        if (k === '$sort') {
            return handleSort(v);
        } else if (k === '$include') {
            return handleInclude(v);
        } else {
            switch (type(v)) {
            case 'object':
                return expandParam(k, v);
            case 'string':
                return [
                    {
                        param: k,
                        value: [v]
                    }
                ];
            case 'number':
                return [
                    {
                        param: k,
                        value: [v]
                    }
                ];
            case 'array':
                return [
                    {
                        param: k,
                        value: [v.join("|")]
                    }
                ];
            default:
                throw "could not linearizeParams " + (type(v));
            }
        }
    };

    var linearizeParams = function(query) {
        return reduceMap(query, function(acc, arg) {
            var k, v;
            k = arg[0], v = arg[1];
            return acc.concat(linearizeOne(k, v));
        });
    };

    var buildSearchParams = function(query) {
        var p, ps;
        ps = (function() {
            var i, len, ref, results;
            ref = linearizeParams(query);
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
                p = ref[i];
                results.push([p.param, p.modifier, '=', p.operator, encodeURIComponent(p.value)].filter(identity).join(''));
            }
            return results;
        })();
        return ps.join("&");
    };

    exports._query = linearizeParams;

    exports.query = buildSearchParams;

    var mw = __webpack_require__(/*! ./core */ "./node_modules/fhir.js/src/middlewares/core.js");

    exports.$SearchParams = mw.$$Attr('url', function(args){
        var url = args.url;
        if(args.query){
             var queryStr = buildSearchParams(args.query);
             return url + "?" + queryStr;
        }
        return url;
    });


    exports.$Paging = function(h){
        return function(args){
            var params = args.params || {};
            if(args.since){params._since = args.since;}
            if(args.count){params._count = args.count;}
            args.params = params;
            return h(args);
        };
    };


}).call(this);


/***/ }),

/***/ "./node_modules/fhir.js/src/middlewares/url.js":
/*!*****************************************************!*\
  !*** ./node_modules/fhir.js/src/middlewares/url.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function() {
    var utils = __webpack_require__(/*! ../utils */ "./node_modules/fhir.js/src/utils.js");
    var core = __webpack_require__(/*! ./core */ "./node_modules/fhir.js/src/middlewares/core.js");

    var id = function(x){return x;};
    var constantly = function(x){return function(){return x;};};

    var get_in = function(obj, path){
        return path.split('.').reduce(function(acc,x){
            if(acc == null || acc == undefined) { return null; }
            return acc[x];
        }, obj);
    };

    var evalPropsExpr = function(exp, args){
        var exps =  exp.split('||').map(function(x){return x.trim().substring(1);});
        for(var i = 0; i < exps.length; i++){
            var res = get_in(args, exps[i]);
            if(res){ return res; }
        }
        return null;
    };

    var evalExpr = function(exp, args){
        if (exp.indexOf(":") == 0){
            return evalPropsExpr(exp, args);
        } else {
            return exp;
        }
    };

    var buildPathPart = function(pth, args){
        var k = evalExpr(pth.trim(), args);
        if(k==null || k === undefined){ throw new Error("Parameter "+pth+" is required: " + JSON.stringify(args)); }
        return k;
    };

    // path chaining function
    // which return haldler wrapper: (h, cfg)->(args -> promise)
    // it's chainable Path("baseUrl").slash(":type").slash(":id").slash("_history")(id, {})({id: 5, type: 'Patient'})
    // and composable p0 = Path("baseUrl); p1 = p0.slash("path)
    var Path = function(tkn, chain){
        //Chainable
        var new_chain = function(args){
            return ((chain && (chain(args) + "/")) || "") +  buildPathPart(tkn, args);
        };
        var ch = core.Attribute('url', new_chain);
        ch.slash = function(tkn){
            return Path(tkn, new_chain);
        };
        return ch;
    };

    exports.Path = Path;
}).call(this);


/***/ }),

/***/ "./node_modules/fhir.js/src/utils.js":
/*!*******************************************!*\
  !*** ./node_modules/fhir.js/src/utils.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var merge = __webpack_require__(/*! merge */ "./node_modules/merge/merge.js");

  var RTRIM = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

  var trim = function(text) {
    return text ? text.toString().replace(RTRIM, "")  : "";
  };

  exports.trim = trim;

  var addKey = function(acc, str) {
    var pair, val;
    if (!str) {
      return null;
    }
    pair = str.split("=").map(trim);
    val = pair[1].replace(/(^"|"$)/g, '');
    if (val) {
      acc[pair[0]] = val;
    }
    return acc;
  };

  var type = function(obj) {
    var classToType;
    if (obj == null && obj === undefined) {
      return String(obj);
    }
    classToType = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regexp',
      '[object Object]': 'object'
    };
    return classToType[Object.prototype.toString.call(obj)];
  };

  exports.type = type;

  var assertArray = function(a) {
    if (type(a) !== 'array') {
      throw 'not array';
    }
    return a;
  };

  exports.assertArray = assertArray;

  var assertObject = function(a) {
    if (type(a) !== 'object') {
      throw 'not object';
    }
    return a;
  };

  exports.assertObject = assertObject;

  var reduceMap = function(m, fn, acc) {
    var k, v;
    acc || (acc = []);
    assertObject(m);
    return ((function() {
      var results;
      results = [];
      for (k in m) {
        v = m[k];
        results.push([k, v]);
      }
      return results;
    })()).reduce(fn, acc);
  };

  exports.reduceMap = reduceMap;

  var identity = function(x) {return x;};

  exports.identity = identity;

  var argsArray = function() {
     return Array.prototype.slice.call(arguments)
  };

  exports.argsArray = argsArray;

  var mergeLists = function() {
    var reduce;
    reduce = function(merged, nextMap) {
      var k, ret, v;
      ret = merge(true, merged);
      for (k in nextMap) {
        v = nextMap[k];
        ret[k] = (ret[k] || []).concat(v);
      }
      return ret;
    };
    return argsArray.apply(null, arguments).reduce(reduce, {});
  };

  exports.mergeLists = mergeLists;

  var absoluteUrl = function(baseUrl, ref) {
    if (!ref.match(/https?:\/\/./)) {
      return baseUrl + "/" + ref;
    } else {
      return ref;
    }
  };

  exports.absoluteUrl = absoluteUrl;

  var relativeUrl = function(baseUrl, ref) {
    if (ref.slice(ref, baseUrl.length + 1) === baseUrl + "/") {
      return ref.slice(baseUrl.length + 1);
    } else {
      return ref;
    }
  };

  exports.relativeUrl = relativeUrl;

  exports.resourceIdToUrl = function(id, baseUrl, type) {
    baseUrl = baseUrl.replace(/\/$/, '');
    id = id.replace(/^\//, '');
    if (id.indexOf('/') < 0) {
      return baseUrl + "/" + type + "/" + id;
    } else if (id.indexOf(baseUrl) !== 0) {
      return baseUrl + "/" + id;
    } else {
      return id;
    }
  };

  var walk = function(inner, outer, data, context) {
    var keysToMap, remapped;
    switch (type(data)) {
      case 'array':
        return outer(data.map(function(item) {
          return inner(item, [data, context]);
        }), context);
      case 'object':
        keysToMap = function(acc, arg) {
          var k, v;
          k = arg[0], v = arg[1];
          acc[k] = inner(v, [data].concat(context));
          return acc;
        };
        remapped = reduceMap(data, keysToMap, {});
        return outer(remapped, context);
      default:
        return outer(data, context);
    }
  };

  exports.walk = walk;

  var postwalk = function(f, data, context) {
    if (!data) {
      return function(data, context) {
        return postwalk(f, data, context);
      };
    } else {
      return walk(postwalk(f), f, data, context);
    }
  };

  exports.postwalk = postwalk;

}).call(this);


/***/ }),

/***/ "./node_modules/merge/merge.js":
/*!*************************************!*\
  !*** ./node_modules/merge/merge.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/*!
 * @name JavaScript/NodeJS Merge v1.2.1
 * @author yeikos
 * @repository https://github.com/yeikos/js.merge

 * Copyright 2014 yeikos - MIT license
 * https://raw.github.com/yeikos/js.merge/master/LICENSE
 */

;(function(isNode) {

	/**
	 * Merge one or more objects 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	var Public = function(clone) {

		return merge(clone === true, false, arguments);

	}, publicName = 'merge';

	/**
	 * Merge two or more objects recursively 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	Public.recursive = function(clone) {

		return merge(clone === true, true, arguments);

	};

	/**
	 * Clone the input removing any reference
	 * @param mixed input
	 * @return mixed
	 */

	Public.clone = function(input) {

		var output = input,
			type = typeOf(input),
			index, size;

		if (type === 'array') {

			output = [];
			size = input.length;

			for (index=0;index<size;++index)

				output[index] = Public.clone(input[index]);

		} else if (type === 'object') {

			output = {};

			for (index in input)

				output[index] = Public.clone(input[index]);

		}

		return output;

	};

	/**
	 * Merge two objects recursively
	 * @param mixed input
	 * @param mixed extend
	 * @return mixed
	 */

	function merge_recursive(base, extend) {

		if (typeOf(base) !== 'object')

			return extend;

		for (var key in extend) {

			if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

				base[key] = merge_recursive(base[key], extend[key]);

			} else {

				base[key] = extend[key];

			}

		}

		return base;

	}

	/**
	 * Merge two or more objects
	 * @param bool clone
	 * @param bool recursive
	 * @param array argv
	 * @return object
	 */

	function merge(clone, recursive, argv) {

		var result = argv[0],
			size = argv.length;

		if (clone || typeOf(result) !== 'object')

			result = {};

		for (var index=0;index<size;++index) {

			var item = argv[index],

				type = typeOf(item);

			if (type !== 'object') continue;

			for (var key in item) {

				if (key === '__proto__') continue;

				var sitem = clone ? Public.clone(item[key]) : item[key];

				if (recursive) {

					result[key] = merge_recursive(result[key], sitem);

				} else {

					result[key] = sitem;

				}

			}

		}

		return result;

	}

	/**
	 * Get type of variable
	 * @param mixed input
	 * @return string
	 *
	 * @see http://jsperf.com/typeofvar
	 */

	function typeOf(input) {

		return ({}).toString.call(input).slice(8, -1).toLowerCase();

	}

	if (isNode) {

		module.exports = Public;

	} else {

		window[publicName] = Public;

	}

})( true && module && typeof module.exports === 'object' && module.exports);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


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

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


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
var fhir_js_1 = __webpack_require__(/*! fhir.js/src/fhir.js */ "./node_modules/fhir.js/src/fhir.js");
var lib_1 = __webpack_require__(/*! ./lib */ "./src/lib.ts");
/**
 * A SMART Client instance will simplify some tasks for you. It will authorize
 * requests automatically, use refresh tokens, handle errors and so on.
 */
var Client = /** @class */ (function () {
    function Client(state) {
        // This might happen if the state have been lost (for example the
        // sessionStorage has been cleared, size limit exceeded etc.).
        if (!state) {
            throw new Error("No state provided to the client");
        }
        this.state = state;
        var accessToken = lib_1.getPath(this.state, "tokenResponse.access_token");
        this.fhirJs = fhir_js_1["default"]({
            baseUrl: state.serverUrl,
            auth: accessToken ?
                { bearer: accessToken } :
                {}
        });
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
        // If we are talking to protected fhir server we should have an access token
        var accessToken = lib_1.getPath(this.state, "tokenResponse.access_token");
        if (accessToken) {
            cfg.headers = tslib_1.__assign({}, cfg.headers, { Authorization: "Bearer " + accessToken });
        }
        return adapter_1["default"].get().http(cfg);
    };
    Client.prototype.get = function (p) {
        // const ret    = Adapter.get().defer();
        // const params: any = { type: p.resource };
        // if (p.id) {
        //     params.id = p.id;
        // }
        // fhirAPI.read(params).then(res => {
        //     ret.resolve(res.data);
        // }, () => {
        //     ret.reject("Could not fetch " + p.resource + " " + p.id);
        // });
        // return ret.promise;
    };
    Client.prototype.getBinary = function (url) {
        // const ret = Adapter.get().defer();
        // Adapter.get().http(this.authenticated({
        //     type: "GET",
        //     url,
        //     dataType: "blob"
        // }))
        // .done(blob => ret.resolve(blob))
        // .fail((...args) => ret.reject("Could not fetch " + url, ...args));
        // return ret.promise;
    };
    Client.prototype.fetchBinary = function (path) {
        // const url = absolute(path, this.server);
        // return this.getBinary(url);
    };
    Client.prototype.authenticated = function (p) {
        // // if (this.server.auth.type == "none") {
        // //     return p;
        // // }
        // let h;
        // if (this.server.auth.type == "basic") {
        //     h = "Basic " + btoa(this.server.auth.username + ":" + this.server.auth.password);
        // } else if (this.server.auth.type == "bearer") {
        //     h = "Bearer " + this.server.auth.token;
        // }
        // if (!p.headers) {
        //     p.headers = {};
        // }
        // p.headers.Authorization = h;
        // return p;
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
    // Test for the conditions that mean we can/want to send/receive blobs or ArrayBuffers - we need XMLHttpRequest
    // level 2 (so feature-detect against window.FormData), feature detect against window.Blob or window.ArrayBuffer,
    // and then check to see if the dataType is blob/ArrayBuffer or the data itself is a Blob/ArrayBuffer
    if (window.FormData && ((options.dataType && (options.dataType === "blob" || options.dataType === "arraybuffer")) ||
        (options.data && ((window.Blob && options.data instanceof Blob) ||
            (window.ArrayBuffer && options.data instanceof ArrayBuffer))))) {
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
                var xhr = new XMLHttpRequest(), url = options.url || window.location.href, type = options.type || "GET", dataType = options.dataType || "text", data = options.data || null, async = options.async || true, key;
                xhr.addEventListener("load", function () {
                    var response = {}, status, isSuccess;
                    isSuccess = xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304);
                    if (isSuccess) {
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
// import * as lib    from "./lib";
// import Client      from "./Client";
var oAuth2 = __webpack_require__(/*! ./oauth */ "./src/oauth.ts");
window.FHIR = {
    // lib,
    // client,
    // ready(options = {
    //     baseUrl: "https://r3.smarthealthit.org/"
    // }) {
    //     // debugger;
    //     return mkFhir(options);
    // },
    oAuth2: {
        settings: {
            replaceBrowserHistory: true,
            fullSessionStorageSupport: true
        },
        authorize: function (options) {
            return oAuth2.authorize(location, options);
        },
        ready: function () {
            return oAuth2.completeAuth(sessionStorage);
        }
    }
};
exports["default"] = {};


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
 * @param location The base location object
 * @param p The name of the parameter
 * @param forceArray If true, return an array if the param is used multiple times
 */
function urlParam(_a, p, forceArray) {
    var search = _a.search;
    if (forceArray === void 0) { forceArray = false; }
    var query = search.substr(1);
    var data = query.split("&");
    var result = [];
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var pair = data_1[_i];
        var _b = pair.split("="), name_1 = _b[0], value = _b[1];
        if (name_1 === p) {
            result.push(decodeURIComponent(value.replace(/\+/g, "%20")));
        }
    }
    if (forceArray) {
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
function urlToAbsolute(url, _a) {
    var protocol = _a.protocol, host = _a.host, pathname = _a.pathname;
    // root
    if (url == "/") {
        return protocol + "//" + host;
    }
    // rooted paths
    if (url.charAt(0) == "/") {
        return protocol + "//" + host + url;
    }
    var srcSegments = String(pathname || "")
        .trim()
        .replace(/^\/$/, "")
        .split("/");
    // special links to the current dir
    if (url === "" || url === ".") {
        if (pathname.charAt(pathname.length - 1) != "/") {
            srcSegments.pop();
        }
        return protocol + "//" + host + srcSegments.join("/") + "/";
    }
    var dstSegments = url.split("/");
    if (pathname.charAt(pathname.length - 1) != "/") {
        srcSegments.pop();
    }
    while (dstSegments.length) {
        var dst = dstSegments.shift();
        if (dst == "..") {
            if (srcSegments.length) {
                srcSegments.pop();
            }
        }
        else if (dst != ".") {
            srcSegments.push(dst);
        }
    }
    var path = srcSegments.join("/").replace(/\/+/g, "/");
    if (path == "/") {
        path = "";
    }
    return protocol + "//" + host + path;
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
/* WEBPACK VAR INJECTION */(function(process) {
exports.__esModule = true;
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var Base64_1 = __webpack_require__(/*! Base64 */ "./node_modules/Base64/base64.js");
var adapter_1 = __webpack_require__(/*! ./adapter */ "./src/adapter.ts");
var Client_1 = __webpack_require__(/*! ./Client */ "./src/Client.ts");
var lib_1 = __webpack_require__(/*! ./lib */ "./src/lib.ts");
function debug() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (process.env.DEBUG) {
        console.log.apply(console, args);
    }
}
function fetchConformanceStatement(baseUrl) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var url, metadata, ex_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = String(baseUrl || "").replace(/\/*$/, "/") + "metadata";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, adapter_1["default"].get().http({ method: "GET", url: url })];
                case 2:
                    metadata = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    ex_1 = _a.sent();
                    console.error(ex_1);
                    throw new Error("Failed to fetch the conformance statement from \"" + url + "\"");
                case 4: return [2 /*return*/, metadata.data];
            }
        });
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
function authorize(location, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var redirect;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    debug("Authorizing...");
                    return [4 /*yield*/, buildAuthorizeUrl(location, options)];
                case 1:
                    redirect = _a.sent();
                    debug("Making authorize redirect to " + redirect);
                    location.href = redirect;
                    return [2 /*return*/];
            }
        });
    });
}
exports.authorize = authorize;
/**
 * First discovers the fhir server base URL from query.iis or query.fhirServiceUrl
 * or options.serverUrl. Then compiles the proper authorization URL for that server.
 * For open servers that URL is the options.redirectUri so that we can skip the
 * authorization part.
 */
function buildAuthorizeUrl(location, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var launch, iss, fhirServiceUrl, serverUrl, metadata, extensions, state, id, redirectUrl, params;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    launch = lib_1.urlParam(location, "launch");
                    iss = lib_1.urlParam(location, "iss");
                    fhirServiceUrl = lib_1.urlParam(location, "fhirServiceUrl");
                    serverUrl = String(iss || fhirServiceUrl || options.serverUrl || "");
                    if (iss && !launch) {
                        throw new Error("Missing url parameter \"launch\"");
                    }
                    if (!serverUrl) {
                        throw new Error("No server url found. It must be specified as query.iss or " +
                            "query.fhirServiceUrl or options.serverUrl (in that order)");
                    }
                    debug("Looking up the authorization endpoint for \"" + serverUrl + "\"");
                    return [4 /*yield*/, fetchConformanceStatement(serverUrl)];
                case 1:
                    metadata = _a.sent();
                    extensions = getSecurityExtensions(metadata);
                    debug("Found security extensions: ", extensions);
                    state = tslib_1.__assign({ serverUrl: serverUrl, clientId: options.clientId, redirectUri: lib_1.urlToAbsolute(options.redirectUri || "", location), scope: options.scope || "" }, extensions);
                    if (options.clientSecret) {
                        debug("Adding clientSecret to the state");
                        state.clientSecret = options.clientSecret;
                    }
                    id = lib_1.randomString(32);
                    sessionStorage.setItem(id, JSON.stringify(state));
                    redirectUrl = state.redirectUri;
                    // debug(state);
                    if (state.authorizeUri) {
                        debug("authorizeUri: " + state.authorizeUri);
                        params = [
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
                    return [2 /*return*/, redirectUrl];
            }
        });
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
function completeAuth(storage) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var state, code, cached, requestOptions;
        return tslib_1.__generator(this, function (_a) {
            debug("Completing the code flow");
            state = lib_1.urlParam(location, "state");
            code = lib_1.urlParam(location, "code");
            cached = getState(state);
            requestOptions = buildTokenRequest(code, cached);
            // The EHR authorization server SHALL return a JSON structure that
            // includes an access token or a message indicating that the
            // authorization request has been denied.
            return [2 /*return*/, adapter_1["default"].get().http(requestOptions)
                    .then(function (_a) {
                    var data = _a.data;
                    debug("Received tokenResponse. Saving it to the state...");
                    cached.tokenResponse = data;
                    storage.setItem(state, JSON.stringify(cached));
                })
                    .then(function () { return new Client_1["default"](cached); })];
        });
    });
}
exports.completeAuth = completeAuth;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/process/browser.js */ "./node_modules/process/browser.js")))

/***/ })

/******/ });
//# sourceMappingURL=fhir-client.js.map