/* Global JS object */
var _global = {
  AppName: 'AppTest',
  Controllers: {
    Base: 'BaseCtrl',
    Test: 'TestCtrl',
    Schedule: 'ScheduleCtrl'
  }
};

/* global angular */
/* global Materialize */
/* global device */
/* global console */
/* global $ */
(function() {
	'use strict';

	var Dependencies = [
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
    var Routes = AppConstants.Routes;
    var Ctrl = _global.Controllers;

    var Views = [
      { route: Routes.Home,         template: 'html/test.html',           ctrl: Ctrl.Test     },
      { route: Routes.Schedule,     template: 'html/schedule.html',       ctrl: Ctrl.Schedule },
    ];

    for(var i = 0; i < Views.length; i++) {
      var view = Views[i];
      $routeProvider.when(view.route, {
        templateUrl: view.template,
        controller: view.ctrl,
      });
    }

    $routeProvider.when('/', {
      redirectTo: Routes.Home
    }).otherwise({
      redirectTo: Routes.Home
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

    //var logger = AppCsf.logger;
    //var config = AppCsf.config;
    var util = AppCsf.util;
    var mConst = AppCsf.appConst;
    var appNavigator = AppCsf.navigator;
    var socketIo = AppCsf.socketIo;

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
    setTimeout(deviceReady, 1000);

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
      $location.path(mConst.Routes.Home);
      var i18n = AppCsf.i18n;
      var dic = AppCsf.dic;

      socketIo.initialize();

      //config.initialize()
      //i18n.initialize()
      //.then(dic.initialize)
      //.then(finalReady);
      finalReady();

    }

    function finalReady() {
      _global.deviceReady = true;
    }

    /**
     * Angular digest
     * @param fn
     */
    function safeApply(fn) {
      var phase = $rootScope.$root.$$phase;
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
