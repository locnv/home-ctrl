
const http = require('http');

const logger = require('koa-logger') ();
const koaBody = require('koa-body');
const kstatic = require('koa-static');
const convert = require('koa-convert');
const compression = require('koa-compress');

const render = require('./server/app-render');
const router = require('./server/app-router');

const _ = require('lodash');
const Koa = require('koa');

//let logger = new KoaLogger();

const PORT = 1337;
const HOST = 'localhost';

function KoaApp() {

  let app = new Koa();
  let koaStatic = convert(kstatic(__dirname + '/server/static'));
  let middleWares = [ koaStatic, logger, render, koaBody(), compression(), router ];
  _.forEach(middleWares, app.use.bind(app));

  let server = http.createServer(app.callback());

  server.on('error', function (error) {
    console.log('[app] An error occurs while loading server.', error);
  });

  server.listen(PORT, HOST, function () {
    console.log(`[app] server listen on: http://${HOST}:${PORT}`);

  });

  return app;
}

module.exports = KoaApp;
