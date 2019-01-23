/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  let Styles = [
    'vendor/bootstrap/css/bootstrap.min.css',
    'css/app-chat.css',
  ];

  let JS = [
    'vendor/admin-lte/bower_components/jquery/dist/jquery.min.js',
    'vendor/admin-lte/bower_components/jquery-ui/jquery-ui.min.js',
    'vendor/socket.io.min.js',
    
    'vendor/angular/angular.min.js',
    'vendor/angular/angular-cookies.min.js',
    'vendor/angular/angular-route.min.js',
    'vendor/angular-translate/angular-translate.min.js',
    'vendor/angular-translate/angular-translate-loader-static-files.min.js',
    'vendor/angular-translate/angular-translate-storage-local.min.js',
    'vendor/angular-translate/angular-translate-storage-cookie.min.js',
    'vendor/bootstrap/js/bootstrap.min.js',
    'vendor/bootstrap-notifier/bootstrap-notify.min.js',
    'vendor/angular/angular-animate.min.js',
    'vendor/fast-click/fast-click.min.js',
    'vendor/admin-lte/bower_components/fastclick/lib/fastclick.js',

    // Native

    // Service
    'js/app.chat.js',
    'js/app.chat.constants.js',
    'js/app.util.js',
    'js/service/service.runtime-storage.js',
    'js/service/service.log.js',
    'js/service/service.i18n.js',
    'js/service/service.help.js',
    'js/service/service.configuration.js',
    'js/service/service.file-storage.js',
    'js/service/service.help.js',
    'js/service/service.csf.js',
    'js/service/service.task-executor.js',
    'js/service/service.notifier.js',
    'js/service/service.navigator.js',
    'js/service/service.dic.js',
    'js/service/service.http.js',

    // Animation -->

    // Directive -->
    'js/directive/directive.button-navigator.js',

    // Controller
    'js/controller/ctrl.base.js',
    'js/controller/ctrl.chat.js',
  ];

  function AppController() { }

  AppController.prototype.load = async function (ctx) {
    await ctx.render('app.chat', {
      styles: Styles,
      scripts: JS,
      AppName: 'AppChat',
      AppTitle: 'Chat room!',
    });
  };

  module.exports = new AppController();

})();