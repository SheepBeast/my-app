let _compiler, _webpackDevServer;
let r;
let ready;

let p = new Promise(resolve => {
  r = resolve;
});

ready = p.then;

const init = (compiler, webpackDevServer) => {
  _compiler = compiler;
  _webpackDevServer = webpackDevServer;

  if (_compiler && _webpackDevServer) {
    r({
      compiler: _compiler,
      webpackDevServer: _webpackDevServer
    });
  }
};

module.exports = {
  init,
  ready
};
