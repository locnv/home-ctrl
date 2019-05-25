
(function() {
  "use strict";


  const router = require('koa-router')();

  /* One entry Controller per app */

  const CtrlAppDemo = require('./server/controller.learnvoca/ctrl.learn.voca');
  const CtrlAuthen  = require('./server/controller.authen/ctrl.authen');
  const CtrlAdmin   = require('./server/controller.admin/ctrl.admin');
  const CtrlChat    = require('./server/controller.chat/ctrl.chat');
  const CtrlTest    = require('./server/controller.test/ctrl.test');
  const CtrlElec    = require('./server/controller.elec-control/ctrl.elec.control');

  function AppRouter() {

    let GET = router.get.bind(router);
    let POST = router.post.bind(router);

    let Routes = {

      '/':            { Fn: GET,                handle: CtrlAppDemo.load          },

      // Test
      '/test':        { Fn: '*',                handle: CtrlTest.load             },
      '/elec_ctrl':   { Fn: POST,               handle: CtrlElec.command          },
      // Chat
      '/chat':        { Fn: '*',                handle: CtrlChat.load             },
      // Card
      '/cards/':      { Fn: '*',                handle: CtrlAppDemo.cards         },
      // Word
      '/words/':      { Fn: '*',                handle: CtrlAppDemo.words         },
      // Words Builder
      '/words_builder/': { Fn: '*',             handle: CtrlAppDemo.wordsBuilder  },

      '/authen':      { Fn: GET,                handle: CtrlAuthen.load           },

      '/admin':       { Fn: GET,                handle: CtrlAdmin.load            }

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
