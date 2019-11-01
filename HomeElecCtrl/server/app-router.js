
(function() {
  "use strict";


  const router = require('koa-router')();

  /* One entry Controller per app */

  const CtrlHome = require('./controller/ctrl.home');

  const DevApi = require('./api/api.device');

  function AppRouter() {

    let GET = router.get.bind(router);
    let POST = router.post.bind(router);

    let Routes = {
      '/': { Fn: GET, handle: CtrlHome.load },

      '/api/dev/list': { Fn: GET, handle: DevApi.getDevices }
      // '/api': { Fn: POST, handle: CtrlHome.handle }
    };

    for(let path in Routes) {
      let route = Routes[path];
      let Fn = route.Fn, handle = route.handle;

      if(typeof Fn === 'string' && Fn === '*') {
        router.get(path, handle);
        router.post(path, handle);
      } else {
        Fn.call(router, path, handle);
      }
    }

    return router.routes();

  }

  module.exports = new AppRouter();

})();
