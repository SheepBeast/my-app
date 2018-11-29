const path = require("path");

const webpack = require("webpack");

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
  watch: true,
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
  plugins: [new webpack.HotModuleReplacementPlugin()],
  // node: {
  //   fs: "empty",
  //   net: "empty",
  //   // 防止打包错乱
  //   __filename: true,
  //   __dirname: true
  // }
};
