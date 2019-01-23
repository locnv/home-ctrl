
const logger = require('koa-logger');
const koaBody = require('koa-body');
const kstatic = require('koa-static');
const convert = require('koa-convert');
const compression = require('koa-compress');

const render = require('./app-render');
const router = require('./app-router');

const _ = require('lodash');
const Koa = require('koa');

function KoaApp() {

  let app = new Koa();
  let koaStatic = convert(kstatic(__dirname + '/static'));
  let middleWares = [ koaStatic, logger(), render, koaBody(), compression(), router ];
  _.forEach(middleWares, app.use.bind(app));

  return app;
}

module.exports = KoaApp;
