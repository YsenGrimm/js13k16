var webpack = require("webpack");

module.exports = {
    entry: "./src/intro.ts",
    output: {
        filename: "./release/game.js",
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".js"]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.ts$/, loader: "ts-loader" }
        ]
    }
};