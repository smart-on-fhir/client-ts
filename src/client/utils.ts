export function urlParam(p, forceArray = false) {
    const query  = location.search.substr(1);
    const data   = query.split("&");
    const result = [];

    for (const pair of data) {
        const [name, value] = pair.split("=");
        if (name === p) {
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

export function stripTrailingSlash(str) {
    if (str.substr(-1) === "/") {
        return str.substr(0, str.length - 1);
    }
    return str;
}

export function relative(url){
    return (location.protocol + "//" + location.host + location.pathname).match(
        /(.*\/)[^\/]*/
    )[1] + url;
}

export function byCodes(observations, property) {
    const bank = byCode(observations, property);
    function byCodes() {
        const ret = [];
        for (let i = 0; i < arguments.length; i++) {
            var set = bank[arguments[i]];
            if (set) {
                [].push.apply(ret, set);
            }
        }
        return ret;
    }

    return byCodes;
}

export function byCode(observations, property){
    const ret = {};

    if (!Array.isArray(observations)){
        observations = [observations];
    }

    observations.forEach(o => {
        if (o.resourceType === "Observation"){
            if (o[property] && Array.isArray(o[property].coding)) {
                o[property].coding.forEach(coding => {
                    ret[coding.code] = ret[coding.code] || [];
                    ret[coding.code].push(o);
                });
            }
        }
    });

    return ret;
}

function ensureNumerical(pq) {
    if (typeof pq.value !== "number") {
        throw new Error(`Found a non-numerical unit: ${pq.value} ${pq.code}`);
    }
}

export const units = {
    cm(pq) {
        ensureNumerical(pq);
        if (pq.code == "cm") {
            return pq.value;
        }
        if (pq.code == "m") {
            return 100 * pq.value;
        }
        if (pq.code == "in") {
            return 2.54 * pq.value;
        }
        if (pq.code == "[in_us]") {
            return 2.54 * pq.value;
        }
        if (pq.code == "[in_i]") {
            return 2.54 * pq.value;
        }
        if (pq.code == "ft") {
            return 30.48 * pq.value;
        }
        if (pq.code == "[ft_us]") {
            return 30.48 * pq.value;
        }
        throw new Error(`Unrecognized length unit: ${pq.code}`);
    },
    kg(pq) {
        ensureNumerical(pq);
        if (pq.code == "kg") {
            return pq.value;
        }
        if (pq.code == "g") {
            return pq.value / 1000;
        }
        if (pq.code.match(/lb/)) {
            return pq.value / 2.20462;
        }
        if (pq.code.match(/oz/)) {
            return pq.value / 35.274;
        }
        throw new Error(`Unrecognized weight unit: ${pq.code}`);
    },
    any(pq) {
        ensureNumerical(pq);
        return pq.value;
    }
};


