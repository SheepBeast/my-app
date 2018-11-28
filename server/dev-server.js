const path = require("path");

const webpackDevConfig = require("../config/webpack.config.dev");
const addition = require("../config/addition");
const { ready } = require("./bind");

ready(({ compiler, webpackDevServer }) => {
  compiler.hooks.done.tap("done", stats => {
    const info = stats.toJson();
    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }
    if (stats.hasErrors()) {
      console.error(info.errors);
      return;
    }
    // 从webpack-dev-middleware中间件存储的内存中读取打包后的文件
    let manifest = webpackDevServer.fileSystem.readFileSync(
      path.join(webpackDevConfig.output.path, addition.manifest),
      "utf-8"
    );
  });
  webpackDevServer.middleware.waitUntilValid(() => {});
});
