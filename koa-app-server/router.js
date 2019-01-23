/**
 * Created by locnv on 10/13/18.
 */

const koaRouter = require('koa-router')();

let mControllers = {};

function Router() {

  //koaRouter.get()
}

Router.prototype.registerRoute = function(route, handle) {
  mControllers[route] = handle;
};

module.exports = new Router();