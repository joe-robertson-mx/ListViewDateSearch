const merge = require("webpack-merge");
const baseConfig = require("./node_modules/@mendix/pluggable-widgets-tools/configs/webpack.config.dev.js"); //Can also be webpack.config.prod.js

const customConfig = {
    externals: [ "react", "react-dom", /^mxui\/|^mendix\/|^dojo\/|^dijit\// ],
    devtool: "source-map"
};
const previewConfig = {
    // Custom configuration goes here
    devtool: "source-map"
};

module.exports = [merge(baseConfig[0], customConfig), merge(baseConfig[1], previewConfig)];