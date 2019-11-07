/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  let Styles = [
    'vendor/bootstrap-4.3.1-dist/css/bootstrap.min.css',
    // 'vendor/bootstrap/css/bootstrap.min.css',
    // 'vendor/bootstrap-toggle/css/bootstrap-toggle.min.css',
    'vendor/animate.css/animate.min.css',
    'css/style.css',
  ];

  let JS = [
    'vendor/jquery/jquery.min.js',
    'vendor/bootstrap-4.3.1-dist/js/bootstrap.min.js',
    // 'vendor/bootstrap/js/bootstrap.min.js',
    // 'vendor/bootstrap-toggle/js/bootstrap-toggle.min.js',
    'vendor/bootstrap-notifier/bootstrap-notify.min.js',
    'vendor/moment/min/moment.min.js',
    'vendor/angular/angular.min.js',
    'vendor/angular/angular-cookies.min.js',
    'vendor/angular/angular-route.min.js',
    'vendor/angular/angular-animate.min.js',
    'vendor/angular-translate/angular-translate.min.js',
    'vendor/angular-translate/angular-translate-loader-static-files.min.js',
    'vendor/angular-translate/angular-translate-storage-local.min.js',
    'vendor/angular-translate/angular-translate-storage-cookie.min.js',
    
    // Native

    // Service
    'js/app.js',
    'js/app.constant.js',
    'js/service/service.util.js',
    'js/service/service.runtime-storage.js',
    'js/service/service.log.js',
    'js/service/service.i18n.js',
    'js/service/service.help.js',
    'js/service/service.file-storage.js',
    'js/service/service.csf.js',
    'js/service/service.notifier.js',
    'js/service/service.speech.js',
    'js/service/service.navigator.js',
    'js/service/service.http.js',
    'js/service/service.device.js',
    'js/service/service.socket-io.js',

    // Animation -->

    // Directive -->
    'js/directive/directive.app-header.js',
    'js/directive/directive.app-footer.js',
    'js/directive/directive.simple-json.js',
    'js/directive/directive.button-navigator.js',
    'js/directive/directive.pin-config.js',

    // Filter -->
    'js/filter/common.filter.js',

    // Controller
    'js/controller/ctrl.base.js',
    'js/controller/ctrl.signin.js',
    'js/controller/ctrl.test.js',
    'js/controller/ctrl.dashboard.js',
    'js/controller/ctrl.dev.add.js'

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

  AppController.prototype.handle = async function(ctx) {
    //ctx.req
  };

  module.exports = new AppController();

})();
