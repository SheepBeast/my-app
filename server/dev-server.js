const path = require("path");
const webpack = require("webpack");
const MemoryFs = require("memory-fs");
const proxy = require("http-proxy-middleware");
const axios = require("axios");

const webpackDevConfig = require("../config/webpack.config.dev");
const webpackDevExpressConfig = require("../config/webpackDevExpress.config");
const { ready } = require("./bind");
const render = require("./render");

const getTemplate = () => axios.get("http://localhost:3000/index.html");

let bundle;

module.exports = function setup(app) {
  const mfs = new MemoryFs();

  const serverCompiler = webpack(webpackDevExpressConfig);

  serverCompiler.outputFileSystem = mfs;

  serverCompiler.watch({}, (err, stats) => {
    console.log("stats ----->");
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

    const file = mfs.readFileSync(bundlePath, "utf8");

    const m = new module.constructor();

    m._compile(file, webpackDevExpressConfig.output.filename);

    bundle = m.exports.default;
  });

  app.use(
    [/^(\/static).*/, /^(\/main\.).*/, /^(\/sockjs).*/, "/favicon.ico"],
    proxy({ changeOrigin: true, target: `http://localhost:3000`, ws: true })
  );

  app.get("/", (req, res) => {
    getTemplate().then(ret => {
      const template = ret.data;
      const indexPage = render({
        template,
        bundle
      });

      res.setHeader("Content-Type", "text/html");
      res.send(indexPage);
      res.end();
    });
  });
};
