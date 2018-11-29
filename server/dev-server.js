const path = require("path");
const webpack = require("webpack");
const MemoryFs = require("memory-fs");
const proxy = require("http-proxy-middleware");

const webpackDevConfig = require("../config/webpack.config.dev");
const webpackDevExpressConfig = require("../config/webpackDevExpress.config");
const { ready } = require("./bind");
const { initApp, initState } = require("./renderer");

let p1, p2, r1, r2;

const render = res => {
  let [html, bundle] = res;

  const page = initApp(html, bundle);

  console.log("page ------>", page);

  // initState(indexHtmlStr, initialState)
};

const init = () => {
  p1 = new Promise(resolve => {
    r1 = resolve;
  });
  p2 = new Promise(resolve => {
    r2 = resolve;
  });
  p = Promise.all([p1, p2]).then(render);
};

module.exports = function setup(app) {
  ready(({ compiler: clientCompiler, webpackDevServer }) => {
    init();

    const fs1 = webpackDevServer.middleware.fileSystem,
      fs2 = new MemoryFs();

    let serverCompiler = webpack(webpackDevExpressConfig);

    clientCompiler.hooks.done.tap("done", () => {
      let url = path.join(webpackDevConfig.output.publicPath, "index.html");
      let html = fs1.getFilenameFromUrl(url);
      console.log("html --------->", html);
      r1(html);
    });

    serverCompiler.outputFileSystem = fs2;

    serverCompiler.hooks.done.tap("done", stats => {
      const info = stats.toJson();

      if (stats.hasErrors()) {
        info.warnings.forEach(console.warn);
      }

      if (stats.hasErrors()) {
        info.errors.forEach(console.error);
        process.exit(1);
      }

      const bundlePath = path.join(
        webpackDevExpressConfig.output.path,
        webpackDevExpressConfig.output.filename
      );

      let bundle = fs2.readFileSync(bundlePath, "utf8");

      let m = new module.constructor();

      m._compile(bundle, webpackDevExpressConfig.output.filename);

      bundle = m.exports.default;

      console.log("bundle --------->", bundle);

      r2(bundle);

      setTimeout(init, 1000);
    });

    const [_, host, port] = webpackDevServer.listeningApp._connectionKey.split(
      ":"
    );
    app.use(
      /^(\/static).*/,
      proxy({ changeOrigin: true, target: `http://${host}:${port}` })
    );
  });
};
