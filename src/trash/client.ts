// var btoa = require('btoa');
import Adapter from "./adapter";



// function ClientPrototype() {}

// var clientUtils = require('./utils');

// Object.keys(clientUtils).forEach(function(k){
//   ClientPrototype.prototype[k] = clientUtils[k];
// });

// function FhirClient(p) {
//   // p.serviceUrl
//   // p.auth {
//     //    type: 'none' | 'basic' | 'bearer'
//     //    basic --> username, password
//     //    bearer --> token
//     // }

//     var client = new ClientPrototype();
//     var fhir = Adapter.get().fhirjs;

//     var server = client.server = {
//       serviceUrl: p.serviceUrl,
//       auth: p.auth || {type: 'none'}
//     }

//     var auth = {};

//     if (server.auth.type === 'basic') {
//         auth = {
//             user: server.auth.username,
//             pass: server.auth.password
//         };
//     } else if (server.auth.type === 'bearer') {
//         auth = {
//             bearer: server.auth.token
//         };
//     }

//     client.api = fhir({
//         baseUrl: server.serviceUrl,
//         auth: auth
//     });

//     if (p.patientId) {
//         client.patient = {};
//         client.patient.id = p.patientId;
//         client.patient.api = fhir({
//             baseUrl: server.serviceUrl,
//             auth: auth,
//             patient: p.patientId
//         });
//         client.patient.read = function(){
//             return client.get({resource: 'Patient'});
//         };
//     }

//     var fhirAPI = (client.patient)?client.patient.api:client.api;

//     client.userId = p.userId;

//     server.auth = server.auth ||  {
//       type: 'none'
//     };

//     if (!client.server.serviceUrl || !client.server.serviceUrl.match(/https?:\/\/.+[^\/]$/)) {
//       throw "Must supply a `server` property whose `serviceUrl` begins with http(s) " + 
//         "and does NOT include a trailing slash. E.g. `https://fhir.aws.af.cm/fhir`";
//     }


//     client.get = function(p) {
//         var ret = Adapter.get().defer();
//         var params = {type: p.resource};

//         if (p.id) {
//             params["id"] = p.id;
//         }

//         fhirAPI.read(params)
//             .then(function(res){
//                 ret.resolve(res.data);
//             }, function(){
//                 ret.reject("Could not fetch " + p.resource + " " + p.id);
//             });

//         return ret.promise;
//     };

//     client.user = {
//       'read': function(){
//         var userId = client.userId;
//         resource = userId.split("/")[0];
//         uid = userId.split("/")[1];
//         return client.get({resource: resource, id: uid});
//       }
//     };

//     return client;
// }

function absolute(path, server) {
    if (path.match(/^http/)) {
        return path;
    }

    if (path.match(/^urn/)) {
        return path;
    }

    // strip leading slash
    if (path.charAt(0) == "/") {
        path = path.substr(1);
    }

    return server.serviceUrl + "/" + path;
}

export default class FhirClient
{
    public server;

    public constructor({ serviceUrl, auth, patientId }) {
        this.server = {
            serviceUrl,
            auth: auth || { type: "none" }
        };

        // var client = new ClientPrototype();
        const fhir = Adapter.get().fhirjs;

        let _auth = {};

        if (this.server.auth.type == "basic") {
            _auth = {
                user: this.server.auth.username,
                pass: this.server.auth.password
            };
        }
        else if (this.server.auth.type == "bearer") {
            _auth = {
                bearer: this.server.auth.token
            };
        }

        this.api = fhir({
            baseUrl: this.server.serviceUrl,
            auth: _auth
        });

        if (patientId) {
            this.userId = patientId;
            this.patient = {
                id: patientId,
                api: fhir({
                    baseUrl: this.server.serviceUrl,
                    auth: _auth,
                    patient: patientId
                }),
                read: () => {
                    return this.get({ resource: "Patient" });
                }
            };
        }

//     var fhirAPI = (client.patient)?client.patient.api:client.api;

//     client.userId = p.userId;

//     server.auth = server.auth ||  {
//       type: 'none'
//     };

//     if (!client.server.serviceUrl || !client.server.serviceUrl.match(/https?:\/\/.+[^\/]$/)) {
//       throw "Must supply a `server` property whose `serviceUrl` begins with http(s) " + 
//         "and does NOT include a trailing slash. E.g. `https://fhir.aws.af.cm/fhir`";
//     }
    }

    public get(p) {
        const ret    = Adapter.get().defer();
        const params: any = { type: p.resource };

        if (p.id) {
            params.id = p.id;
        }

        fhirAPI.read(params).then(res => {
            ret.resolve(res.data);
        }, () => {
            ret.reject("Could not fetch " + p.resource + " " + p.id);
        });

        return ret.promise;
    }

    public getBinary(url) {

      const ret = Adapter.get().defer();

      Adapter.get().http(this.authenticated({
        type: "GET",
        url,
        dataType: "blob"
      }))
      .done(blob => ret.resolve(blob))
      .fail((...args) => ret.reject("Could not fetch " + url, ...args));
      return ret.promise;
    }

    public fetchBinary(path) {
        const url = absolute(path, this.server);
        return this.getBinary(url);
    }

    public authenticated(p) {
        if (this.server.auth.type == "none") {
            return p;
        }

        let h;
        if (this.server.auth.type == "basic") {
            h = "Basic " + btoa(this.server.auth.username + ":" + this.server.auth.password);
        } else if (this.server.auth.type == "bearer") {
            h = "Bearer " + this.server.auth.token;
        }
        if (!p.headers) {
            p.headers = {};
        }
        p.headers.Authorization = h;

        return p;
    }
}
