/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  let Styles = [
    'vendor/bootstrap/css/bootstrap.min.css',
    'css/style.css',
  ];

  let JS = [
    'vendor/jquery/jquery.min.js',
    'vendor/bootstrap/js/bootstrap.min.js',
    'vendor/moment/min/moment.min.js',
    
    // Native

    // Service
    'js/index.js'
  ];

  function AppController() { }

  AppController.prototype.load = async function (ctx) {
    await ctx.render('index', {
      styles: Styles,
      scripts: JS,
      AppName: 'AppTest',
      AppTitle: 'Configuration app!',
    });
  };

  module.exports = new AppController();

})();
