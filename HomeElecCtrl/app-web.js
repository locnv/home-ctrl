
const http = require('http');
const logger = require('./util/logger');

const koaLogger = require('koa-logger') ();
const koaBody = require('koa-body');
const kstatic = require('koa-static');
const convert = require('koa-convert');
const compression = require('koa-compress');

const render = require('./web/app-render');
const router = require('./web/app-router');

const _ = require('lodash');
const Koa = require('koa');

const PORT = 1337;
// const HOST = 'localhost';
const HOST = '';

function KoaApp() {

  let app = new Koa();
  let koaStatic = convert(kstatic(__dirname + '/web/static'));
  let middleWares = [ koaStatic, koaLogger, render, koaBody(), compression(), router ];
  _.forEach(middleWares, app.use.bind(app));

  let server = http.createServer(app.callback());

  server.on('error', function (error) {
    logger.info('[app] An error occurs while loading server.', error);
  });

  server.listen(PORT, HOST, function () {
    logger.info(`[app] server listen on: http://${HOST}:${PORT}`);

  });

  return app;
}

module.exports = KoaApp;
