const combiner = Symbol.for("combiner");
const c = (global[combiner] = {
  compiler: null,
  webpackDevServer: null,
  resolve: null,
  isReady: false
});

const make = (compiler, webpackDevServer) => ({ compiler, webpackDevServer });

const ready = callback => {
  console.log("ready isready -->", c.isReady);

  if (c.isReady) {
    callback(make(c.compiler, c.webpackDevServer));
  } else {
    new Promise(resolve => {
      c.resolve = resolve;
    });
  }
};

const init = (compiler, webpackDevServer) => {
  if (c.isReady) {
    return;
  }
  c.compiler = compiler;
  c.webpackDevServer = webpackDevServer;

  if (c.compiler && c.webpackDevServer) {
    console.log("init isReady -->", c.isReady);

    c.isReady = true;

    typeof c.resolve == "function" &&
      c.resolve(make(c.compiler, c.webpackDevServer));
  }
};

module.exports = {
  init,
  ready
};
