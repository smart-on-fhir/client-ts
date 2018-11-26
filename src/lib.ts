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
 * @param location The base location object
 * @param p The name of the parameter
 * @param forceArray If true, return an array if the param is used multiple times
 */
export function urlParam({ search }: Location, p: string, forceArray: boolean = false): string | string[] | null {
    const query  = search.substr(1);
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
export function urlToAbsolute(url, { protocol, host, pathname }: Location) {

    // root
    if (url == "/") {
        return protocol + "//" + host;
    }

    // rooted paths
    if (url.charAt(0) == "/") {
        return protocol + "//" + host + url;
    }

    const srcSegments = String(pathname || "")
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

    const dstSegments = url.split("/");

    if (pathname.charAt(pathname.length - 1) != "/") {
        srcSegments.pop();
    }

    while (dstSegments.length) {
        const dst = dstSegments.shift();
        if (dst == "..") {
            if (srcSegments.length) {
                srcSegments.pop();
            }
        }
        else if (dst != ".") {
            srcSegments.push(dst);
        }
    }

    let path = srcSegments.join("/").replace(/\/+/g, "/");
    if (path == "/") {
        path = "";
    }

    return protocol + "//" + host + path;
}

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
