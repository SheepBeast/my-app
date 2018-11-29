module.exports = function(callback) {
  const http = require("http");
  const express = require("express");
  const webpackDevExpressConfig = require("../config/webpackDevExpress.config");
  const setupDevSever = require("./dev-server");

  const app = express();

  app.use(require("morgan")("short"));

  app.use("/public", express.static(webpackDevExpressConfig.output.publicPath));

  app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
  });

  if (process.env.NODE_ENV != "production") {
    try {
      setupDevSever(app);
    } catch (e) {
      console.error("setup dev server error -->", e);
      process.exit(1);
    }
  }

  const server = http.createServer(app).listen(3001, "localhost", function() {
    callback && callback();

    const { address, port } = server.address();

    console.log(
      `\nBackend server is listening on\n\n  http://${address}:${port}\n`
    );
  });
};
