/* Global JS object */
let _global = {
  AppName: 'AppTest',
  Controllers: {
    Base: 'BaseCtrl',
    SignIn: 'SignInCtrl',
    Dashboard: 'DashboardCtrl',
    AddDevice: 'AddDevCtrl',
    Test: 'TestCtrl'
  }
};

String.prototype.format = function () {
  let a = this;
  for (let k in arguments) {
    a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
  }
  return a;
};

/* global angular */
/* global Materialize */
/* global device */
/* global console */
/* global $ */
(function() {
  'use strict';

  let Dependencies = [
    'ngRoute',
    'ngAnimate',
    'ngCookies',
    'pascalprecht.translate' ];

  angular
    .module(_global.AppName, Dependencies)
    .config(configRoutes)
    .config(configI18n)
    .run(runApp);

  ////////////////////////////////////////////////////////////
  //// ++ Configure I18N
  ////////////////////////////////////////////////////////////

  configI18n.$inject = [ '$translateProvider' ];

  function configI18n($translateProvider) {

    $translateProvider.useStaticFilesLoader({
      prefix: './js/i18n/',
      suffix: '.json'
    });

    // Tell the module what language to use by default
    $translateProvider.useLocalStorage();
    //$translateProvider.preferredLanguage('en_EN');
  }

  ////////////////////////////////////////////////////////////
  //// -- Configure I18N
  ////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////////////////
  //// ++ Route configuration
  ////////////////////////////////////////////////////////////
  configRoutes.$inject = [ '$routeProvider','AppConstants' ];
  function configRoutes($routeProvider, AppConstants) {
    let Routes = AppConstants.Routes;
    let Ctrl = _global.Controllers;

    let Views = [
      { route: Routes.Dashboard, template: 'html/dashboard.html', ctrl: Ctrl.Dashboard },
      { route: Routes.AddDevice, template: 'html/dev-add.html', ctrl: Ctrl.AddDevice },
      { route: Routes.PiPinout, template: 'html/pigpio-map.html', ctrl: function() {} },
      { route: Routes.SignIn, template: 'html/signin.html', ctrl: Ctrl.Schedule  },
      { route: Routes.Test, template: 'html/test.html', ctrl: Ctrl.Test },
    ];

    for(let i = 0; i < Views.length; i++) {
      let view = Views[i];
      $routeProvider.when(view.route, {
        templateUrl: view.template,
        controller: view.ctrl,
      });
    }

    $routeProvider.when('/', {
      redirectTo: Routes.Dashboard
    }).otherwise({
      redirectTo: Routes.Dashboard
    });

    // Configure html5 to get links working
    // If you don't do this, you URLs will be base.com/#/home rather than base.com/home
    //$locationProvider.html5Mode(true);
  }

  ////////////////////////////////////////////////////////////
  //// -- Route configuration
  ////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////////////////
  //// ++ Application initialization
  ////////////////////////////////////////////////////////////

  runApp.$inject = [ '$rootScope', '$location', 'AppCsf' ];
  function runApp($rootScope, $location, AppCsf) {

    // let logger = AppCsf.logger;
    // let config = AppCsf.config;
    let util = AppCsf.util;
    let mConst = AppCsf.appConst;
    let appNavigator = AppCsf.navigator;
    let socketIo = AppCsf.socketIo;

    /* Application's info (name, version, ...) */
    $rootScope.AppInfo = {
      Name: mConst.AppName,
      PageTitle: '',
      Version: mConst.APP_VERSION,
    };

    $rootScope.AppFooter = {
      btnLeft: {},
      btnRight: {},
      btnMiddle: {},
    };

    $rootScope.safeApply = safeApply;

    document.addEventListener("backbutton", onBackButtonClicked, false);
    document.addEventListener("deviceready", deviceReady, false);

    // If Browser
    setTimeout(deviceReady, 100);

    /**
     * On 'Back' physical button handle
     */
    function onBackButtonClicked() {
      if (!appNavigator.isHomePage() || util.isBrowser()) {
        return;
      }

      navigator.app.exitApp();
    }

    /**
     * On device ready
     */
    function deviceReady() {

      $location.path(mConst.Routes.Dashboard);

      let i18n = AppCsf.i18n;
      let dic = AppCsf.dic;

      socketIo.initialize();

      i18n.initialize()
      .then(dic.initialize)
      .then(finalReady);

    }

    function finalReady() {
      _global.deviceReady = true;
    }

    /**
     * Angular digest
     * @param fn
     */
    function safeApply(fn) {
      let phase = $rootScope.$root.$$phase;
      if (phase === '$apply' || phase === '$digest') {
        if (fn && (typeof (fn) === 'function')) {
          fn();
        }
      } else {
        $rootScope.$apply(fn);
      }
    }
  }

  ////////////////////////////////////////////////////////////
  //// -- Application initialization
  ////////////////////////////////////////////////////////////

}());
