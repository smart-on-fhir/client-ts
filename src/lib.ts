// This is the shared static library, meaning that it is simple collection of
// pure functions. It is important for these function to not have side effects
// so that the file behaves well with tree-shaking (and is fully testable).

/**
 * Walks through an object (or array) and returns the value found at the
 * provided path. This function is very simple so it intentionally does not
 * support any argument polymorphism, meaning that the path can only be a
 * dot-separated string. If the path is invalid returns undefined.
 * @param {Object} obj The object (or Array) to walk through
 * @param {String} path The path (eg. "a.b.4.c")
 * @returns {*} Whatever is found in the path or undefined
 */
export function getPath(obj: object|any[], path: string = ""): any {
    path = path.trim();
    if (!path) {
        return obj;
    }
    return path.split(".").reduce(
        (out, key) => out ? (out as any)[key] : undefined,
        obj
    );
}

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
export function urlParam(p: string, options: { forceArray?: boolean, location: Location } = { location }): string | string[] | null {
    const loc    = options.location;
    const query  = loc.search.substr(1);
    const data   = query.split("&");
    const result = [];

    data.forEach(pair => {
        const [name, value] = pair.split("=");
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

/**
 * If the argument string ends with a slash - remove it.
 * @param str The string to trim
 */
export function stripTrailingSlash(str?: any) {
    return String(str || "").replace(/\/+$/, "");
}

/**
 * Converts relative URL to absolute based on the given location
 * @param url The URL to convert
 * @param location The base location object
 */
export function urlToAbsolute(url, doc: Document = document) {
    const a = doc.createElement("a");
    a.setAttribute("href", url);
    return a.href;
}

/**
 * This is similar to the `urlToAbsolute` function but you can pass the domain
 * serverUrl. It is used to convert relative URIs to absolute ones.
 * @param path The path to convert to absolute. If it begins with "http" or
 * "urn", it will be returned as is.
 * @param serverUrl The base URL of the resulting url. If empty, the current
 * document URL will be used. Defaults to "".
 */
export function resolve(path, serverUrl = "") {
    if (path.match(/^(http|urn)/)) return path;
    if (!serverUrl) return urlToAbsolute(path);
    return [
        serverUrl.replace(/\/$\s*/, ""),
        path.replace(/^\s*\//, "")
    ].join("/");
}

/**
 * Generates random strings. By default this returns random 8 characters long
 * alphanumeric strings.
 * @param strLength The length of the output string. Defaults to 8.
 * @param charSet A string containing all the possible characters. Defaults to
 * all the upper and lower-case letters plus digits.
 */
export function randomString(strLength = 8, charSet = null) {
    const result = [];

    charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                         "abcdefghijklmnopqrstuvwxyz" +
                         "0123456789";

    const len = charSet.length;
    while (strLength--) {
        result.push(charSet.charAt(Math.floor(Math.random() * len)));
    }
    return result.join("");
}

/**
 * Used in fetch Promise chains to reject if the "ok" property is not true
 */
export async function checkResponse(resp: Response): Promise<Response> {
    if (!resp.ok) {
        throw (await humanizeError(resp));
    }
    return resp;
}

/**
 * Used in fetch Promise chains to return the JSON bersion of the response
 */
export function responseToJSON(resp: Response) {
    return resp.json();
}

export function fetchJSON(url: RequestInfo, options?: RequestInit) {
    return fetch(url, options).then(checkResponse).then(responseToJSON);
}

export async function humanizeError(resp: Response): Promise<never> {
    let msg = resp.status + " " + resp.statusText;

    try {
        const json = await resp.json();
        if (json.error) {
            msg += "\n" + json.error;
            if (json.error_description) {
                msg += ": " + json.error_description;
            }
        }
        else {
            msg += "\n" + json;
        }
    } catch (_) {
        try {
            const text = await resp.text();
            if (text) {
                msg += "\n" + text;
            }
        } catch (_) {
            // ignore
        }
    }

    // msg += "\nURL: " + resp.url;

    throw new Error(msg);
}

// $lab:coverage:off$
export function debug(...args) {
    if (sessionStorage.debug) {
        console.log(...args);
    }
}
// $lab:coverage:on$
