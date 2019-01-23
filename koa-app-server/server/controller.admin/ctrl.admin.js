/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  let Styles = [
    'vendor/bootstrap/css/bootstrap.min.css',
    'vendor/admin-lte/css/AdminLTE.min.css',
    'vendor/admin-lte/css/skins/_all-skins.min.css',
    'vendor/admin-lte/bower_components/font-awesome/css/font-awesome.min.css',
    'vendor/admin-lte/bower_components/Ionicons/css/ionicons.min.css',

    'css/app.css',
    'css/app.signup.css',
  ];

  let JS = [
    'vendor/admin-lte/bower_components/jquery/dist/jquery.min.js',
    'vendor/admin-lte/bower_components/jquery-ui/jquery-ui.min.js',
    
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
    'vendor/digest-hub/digest-hud.js',
    'vendor/admin-lte/bower_components/raphael/raphael.min.js',
    'vendor/admin-lte/bower_components/morris.js/morris.min.js',
    'vendor/admin-lte/bower_components/jquery-sparkline/dist/jquery.sparkline.min.js',
    'vendor/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js',
    'vendor/plugins/jvectormap/jquery-jvectormap-world-mill-en.js',
    'vendor/admin-lte/bower_components/jquery-knob/dist/jquery.knob.min.js',
    'vendor/admin-lte/bower_components/moment/min/moment.min.js',
    'vendor/admin-lte/bower_components/bootstrap-daterangepicker/daterangepicker.js',
    'vendor/admin-lte/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
    'vendor/admin-lte/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js',
    'vendor/admin-lte/bower_components/jquery-slimscroll/jquery.slimscroll.min.js',
    'vendor/admin-lte/bower_components/fastclick/lib/fastclick.js',
    'vendor/admin-lte/js/pages/dashboard.js',
    'vendor/admin-lte/js/demo.js',
    'vendor/admin-lte/js/adminlte.min.js',

    // Native

    // Service
    'js/app.admin.js',
    'js/app.admin.constants.js',
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
    'js/controller/ctrl.admin.js',
  ];

  function AppController() { }

  AppController.prototype.load = async function (ctx) {
    await ctx.render('app.admin.lte', {
      styles: Styles,
      scripts: JS,
      AppName: 'Admin',
      AppTitle: 'Admin!',
    });
  };

  module.exports = new AppController();

})();