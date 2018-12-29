import { getPath } from "./lib";

const KEY = "smartId";

function key() {
    return sessionStorage.getItem(KEY);
}

function getState() {
    const smartId = key();
    if (!smartId) {
        console.warn(`sessionStorage["${KEY}"] is missing or empty`);
        return null;
    }

    const cached = sessionStorage.getItem(smartId);
    if (!cached) {
        console.warn(`No state found by the given id (${smartId})`);
        return null;
    }

    try {
        return JSON.parse(cached);
    } catch (_) {
        console.warn(
            `Corrupt state: sessionStorage['${KEY}'] cannot be parsed as JSON.`
        );
        return null;
    }
}


export default {

    key: () => key(),

    get(path: string = "") {
        const state = getState();
        if (path) {
            return getPath(state || {}, path);
        }
        return state;
    },

    set(data) {
        sessionStorage.setItem(key(), JSON.stringify(data));
    },

    extend(data) {
        const state = getState() || {};
        sessionStorage.setItem(key(), JSON.stringify({ ...state, ...data }));
    },

    clear() {
        sessionStorage.removeItem(key());
    }
};
