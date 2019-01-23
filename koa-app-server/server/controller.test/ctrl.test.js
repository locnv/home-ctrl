/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  let Styles = [
    'vendor/bootstrap/css/bootstrap.min.css',
    'vendor/bootstrap-slider/css/bootstrap-slider.css',
    'vendor/bootstrap-toggle/css/bootstrap-toggle.min.css',
    'vendor/loader/css-loader.css',
    'vendor/bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
    'css/app-test.css',
  ];

  let JS = [
    'vendor/admin-lte/bower_components/jquery/dist/jquery.min.js',
    'vendor/admin-lte/bower_components/jquery-ui/jquery-ui.min.js',
    'vendor/bootstrap/js/bootstrap.min.js',
    'vendor/bootstrap-toggle/js/bootstrap-toggle.min.js',
    'vendor/bootstrap-notifier/bootstrap-notify.min.js',
    'vendor/bootstrap-slider/bootstrap-slider.js',
    'vendor/moment/min/moment.min.js',
    'vendor/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
    'vendor/socket.io.min.js',
    
    'vendor/angular/angular.min.js',
    'vendor/angular/angular-cookies.min.js',
    'vendor/angular/angular-route.min.js',
    'vendor/angular-translate/angular-translate.min.js',
    'vendor/angular-translate/angular-translate-loader-static-files.min.js',
    'vendor/angular-translate/angular-translate-storage-local.min.js',
    'vendor/angular-translate/angular-translate-storage-cookie.min.js',
    'vendor/angular/angular-animate.min.js',
    'vendor/fast-click/fast-click.min.js',

    // Native

    // Service
    'js/app.test.js',
    'js/app.test.constants.js',
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
    'js/service/service.speech.js',
    'js/service/service.navigator.js',
    'js/service/service.dic.js',
    'js/service/service.http.js',
    'js/service/service.socket-io.js',
    'js/communication/device.comm.js',

    // Animation -->

    // Directive -->
    'js/directive/directive.button-navigator.js',
    'js/directive/directive.modal.js',
    'js/directive/directive.modal.schedule.js',

    // Controller
    'js/controller/ctrl.base.js',
    'js/controller/ctrl.test.js',
    'js/controller/ctrl.schedule.js',
    'js/controller/ctrl.voice-ctrl.js'
  ];

  function AppController() { }

  AppController.prototype.load = async function (ctx) {
    await ctx.render('app.test', {
      styles: Styles,
      scripts: JS,
      AppName: 'AppTest',
      AppTitle: 'Test application!',
    });
  };

  module.exports = new AppController();

})();