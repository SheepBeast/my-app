const WebpackNodeExternals = require("webpack-node-externals");
const path = require("path");

const { appBuild, appPackageJson, appPublic } = require("./paths");

const { babel: babalLoaderQuery } = require(appPackageJson);

module.exports = {
  entry: path.join(__dirname, "../server/entry.js"),
  output: {
    path: appBuild,
    filename: "server-bundle.js",
    publicPath: appPublic,
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: babalLoaderQuery
      }
    ]
  },
  target: "node",
  mode: "development",
  externals: [WebpackNodeExternals()]
};
