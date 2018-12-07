const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    entry: "./src/index.ts",

    output: {
        filename: "fhir-client.js",
        path    : __dirname + "/dist"
    },

    // Enable sourcemaps for debugging webpack output.
    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test   : /\.ts$/,
                loader : "awesome-typescript-loader",
                exclude: /node_modules/,
                options: {
                    errorsAsWarnings: true
                }
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test   : /\.js$/,
                loader : "source-map-loader"
            }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    // externals: {
    //     "jsonwebtoken": "jsonwebtoken",
    //     "jquery"      : "jQuery",
    //     "fhir.js": "fhir"
    // },

    plugins: [
        new BundleAnalyzerPlugin()
    ]
};
