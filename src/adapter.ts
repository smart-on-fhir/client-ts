let adapter;

export default {
    debug: true,

    set(newAdapter) {
        adapter = newAdapter;
    },

    get() {
        return adapter;
    }
};
