/* Global JS object */
var _global = {
  AppName: 'LearnVoca',
  Controllers: {
    Base:           'BaseCtrl',
    Home:           'HomeCtrl',
    SignUp:         'SignUpCtrl',
    SignIn:         'SignInCtrl',
    Card:           'CardCtrl',
    Word:           'WordCtrl',
    WordBuilder:    'WordBuilderCtrl',
    WordCreate:     'WordCreateCtrl',
    About:          'AboutCtrl',
    Setting:        'SettingCtrl',
    Test:           'TestCtrl',
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
    'pascalprecht.translate',
    'digestHud' ];

	angular
    .module(_global.AppName, Dependencies)
    .config(configRoutes)
    .config(configI18n)
    .config(configDigestHub)
    .run(runApp );

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
  //// ++ Configure Digest hub
  ////////////////////////////////////////////////////////////

  configDigestHub.$inject = [ 'digestHudProvider', 'AppConstants' ];

  function configDigestHub(digestHudProvider, AppConstants) {

    if(AppConstants.ENV !== 'dev') {
      return;
    }

    digestHudProvider.enable();

    // Optional configuration settings:
    digestHudProvider.setHudPosition('top left'); // setup hud position on the page: top right, bottom left, etc. corner
    digestHudProvider.numTopWatches = 20;  // number of items to display in detailed table
    digestHudProvider.numDigestStats = 25;  // number of most recent digests to use for min/med/max stats
  }

  ////////////////////////////////////////////////////////////
  //// -- Configure Digest hub
  ////////////////////////////////////////////////////////////


	////////////////////////////////////////////////////////////
  //// ++ Route configuration
  ////////////////////////////////////////////////////////////
	configRoutes.$inject = [ '$routeProvider','AppConstants' ];
	function configRoutes($routeProvider, AppConstants) {
    var Routes = AppConstants.Routes;
    var Ctrl = _global.Controllers;

    var Views = [
      { route: Routes.Home,           template: 'html/home.html',             ctrl: Ctrl.Home             },
      { route: Routes.SignUp,         template: 'html/signup.html',           ctrl: Ctrl.SignUp           },
      { route: Routes.SignIn,         template: 'html/signin.html',           ctrl: Ctrl.SignIn           },
      { route: Routes.Card,           template: 'html/card.html',             ctrl: Ctrl.Card             },
      { route: Routes.Word,           template: 'html/word.html',             ctrl: Ctrl.Word             },
      { route: Routes.WordBuilder,    template: 'html/word-builder.html',     ctrl: Ctrl.WordBuilder      },
      { route: Routes.WordCreate,     template: 'html/word-create.html',      ctrl: Ctrl.WordCreate       },
      { route: Routes.About,          template: 'html/about.html',            ctrl: Ctrl.About            },
      { route: Routes.Setting,        template: 'html/setting.html',          ctrl: Ctrl.Setting          },
      { route: Routes.Test,           template: 'html/test.html',             ctrl: Ctrl.Test             },
    ];

    for(var i = 0; i < Views.length; i++) {
      var view = Views[i];
      $routeProvider.when(view.route, {
        templateUrl: view.template,
        controller: view.ctrl,
      });
    }

    $routeProvider.when('/', {
      //redirectTo: Routes.Home
      redirectTo: Routes.WordBuilder
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

    var logger = AppCsf.logger;
    var config = AppCsf.config;
    var util = AppCsf.util;
    var mConst = AppCsf.appConst;
    var appNavigator = AppCsf.navigator;

    /* Application's info (name, version, ...) */
    $rootScope.AppInfo = {
      Name: mConst.AppName,
      PageTitle: '',
      Version: mConst.APP_VERSION,
    };

    /* Define the Application's status bar (UI) */
    $rootScope.AppStatus = {
      activated: false,
      isError: false,
      /* The message to be displayed */
      message: '',

      // Timeout thread
      // Each message will be displayed for 5 seconds
      // This task is created as a new message is set
      // If another message is set during this TO, it is reset.
      _to: null,

      toggleStatus: function() {
        this.activated = !this.activated;
      }
    };

    /* Footer's configuration */
    $rootScope.AppFooter = {
      //enabled: true,
      btnLeft: {
        active: false,
        enabled: false,
        caption: 'Back',
        icon: '',
        onClickedHandle: null,
        context: null,
      },

      // Button middle
      btnMiddle: {},

      // Button right,
      btnRight: {},

      // Global context menu

      // Function
      //setEnable: function(enabled) {
      //  this.enabled = enabled;
      //}
    };

    $rootScope.Helper = {
      active: false,
      helpId: -1,

      showHelp: function(id) {
        this.active = true;
        this.helpId = id;
      },

      dismiss: function() {
        this.active = false;
      }
    };

    $rootScope.safeApply = safeApply;
    $rootScope.setStatusBarMessage = setStatusBarMessage;
    $rootScope.toggleFavPanel = toggleFavPanel;

    document.addEventListener("backbutton", onBackButtonClicked, false);
    document.addEventListener("deviceready", deviceReady, false);

    // If Browser
    setTimeout(deviceReady, 1000);

    /**
     * On 'Back' physical button handle
     */
    function onBackButtonClicked() {
      if(!appNavigator.isHomePage() || util.isBrowser()) {
        return;
      }

      navigator.app.exitApp();
    }

    /**
     * On device ready
     */
    function deviceReady() {
      var i18n = AppCsf.i18n;
      var dic = AppCsf.dic;

      //config.initialize()
      i18n.initialize()
      .then(dic.initialize)
      .then(finalReady);
      //finalReady();

      /* ++ Head's title affix */
      $("#app-page-title").affix({
        offset: {
          /* Set top offset equal to header outer height including margin */
          top: $("#learnvoca-header").outerHeight(true),
        }
      });
      /* -- Head's title affix */

    }

    function finalReady() {
      //writeInitLog();
      logger.info("Device ready!");
      _global.deviceReady = true;
      //$location.path(mConst.Routes.Home);

      //Init ads on mobile and production only
      //if(!util.isBrowser() && mConst.ENV === 'prod') {
      //  setTimeout(initAd_damnIt, 3000);
      //}

      // 19.7.2018 -> try out with Mopub (Twitter)
      //if(!util.isBrowser() && mConst.ENV === 'prod') {
      //  setTimeout(mopubAds.initialize, 3000);
      //  setTimeout(amazonAds.initialize, 3000);
      //}
    }

    function setStatusBarMessage(message, isError) {
      if(!util.isNullOrUndefined(isError)) {
        $rootScope.AppStatus.isError = isError;
      }

      $rootScope.AppStatus.message = message;
      $rootScope.AppStatus.activated = true;

      if($rootScope.AppStatus._to !== null) {
        clearTimeout($rootScope.AppStatus._to);
        $rootScope.AppStatus._to = null;
      }
      $rootScope.AppStatus._to = setTimeout(function() {
        $rootScope.AppStatus.message = '';
        $rootScope.$digest();
      }, 5000);
    }

    function toggleFavPanel() {
      $('#sidebar, #content').toggleClass('active');
      $('.collapse.in').toggleClass('in');
      $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    }

    function writeInitLog() {
      var startUpMessage = '\n\n======Start Learn Voca application. V' +
        mConst.APP_VERSION + '.\nLocal time: ' + new Date().toTimeString();

      if (!util.isNullOrUndefined(device)) {
        var devInfo = '\nModel: ' + device.model    +
          ';\nPlatform: ' + device.platform         +
          ';\nVersion: ' + device.version           +
          ';\nUuid: ' + device.uuid                 +
          ';\nManufacturer: ' + device.manufacturer;

        startUpMessage += devInfo;
      }
      startUpMessage += '\n=================================================\n';
      logger.info(startUpMessage);
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


    //////////////////////////////////////
    /// Admob
    //initialize the goodies
    function initAd_damnIt() {
      if (window.plugins && window.plugins.AdMob) {

        //ca-app-pub-5544942443566249~8984116345
        //ca-app-pub-5544942443566249/1245227129
        var ad_units = {
          ios: {
            banner: 'ca-app-pub-xxxxxxxxxxx/xxxxxxxxxxx',		        //PUT ADMOB ADCODE HERE
            interstitial: 'ca-app-pub-xxxxxxxxxxx/xxxxxxxxxxx'	    //PUT ADMOB ADCODE HERE
          },
          android: {
            //banner: 'ca-app-pub-5544942443566249/1245227129',		    //PUT ADMOB ADCODE HERE
            //interstitial: 'ca-app-pub-5544942443566249/8812849669'	//PUT ADMOB ADCODE HERE

            banner: 'ca-app-pub-8702098377488997~5627010591',
            interstitial: 'ca-app-pub-8702098377488997/5404892586',
          }
        };
        var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;

        window.plugins.AdMob.setOptions({
          publisherId: admobid.banner,
          interstitialAdId: admobid.interstitial,
          adSize: window.plugins.AdMob.AD_SIZE.SMART_BANNER,	//use SMART_BANNER, BANNER, LARGE_BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD
          bannerAtTop: false, // set to true, to put banner at top
          overlap: false, // banner will overlap webview
          offsetTopBar: false, // set to true to avoid ios7 status bar overlap
          isTesting: true, // receiving test ad
          autoShow: false // auto show interstitial ad when loaded
        });

        registerAdEvents();

        if(canShowIntersialAds()) {
          window.plugins.AdMob.createInterstitialView();	//get the interstitials ready to be shown
          window.plugins.AdMob.requestInterstitialAd();

          setTimeout(showInterstitialFunc1, 1000);
        } else {
          //logger.debug('[ADS] >>> Not a good time to show full screen ads.');
        }

        setTimeout(showBannerFunc, 2000);
      } else {
        logger.debug('[ads] - Admob plugin not ready!');
      }
    }

    function canShowIntersialAds() {
      /*var n = new Date().getTime();
      var tmp = config.getInt(mConst.CfgKeys.InstallTime, n);
      var installTime = tmp;
      if(n - installTime <= 15*24*60*60*1000) {
        // Let it be free for at least first 10 days.
        logger.debug('Application in first period running.');
        return false;
      }

      tmp = config.getInt(mConst.CfgKeys.LastShow, n);
      var lastShow = tmp;
      if(n - lastShow >= 2*24*60*60*1000) {
        return true;
      }*/

      return false;
    }

    var mInterstialReceived = false;
    var mWaitForAddCounter = 10;

    /**
     * Show intersial ads
     */
    function showInterstitialFunc1() {
      if(--mWaitForAddCounter <= 0) {
        return; // I failed.
      }
      if(!mInterstialReceived) {
        setTimeout(showInterstitialFunc1, 2000);
        return;
      }

      //logger.debug('SOUND GOOD .... GOING TO SHOW IT>>>>');
      showInterstitialFunc();

    }

    //functions to allow you to know when ads are shown, etc.
    function registerAdEvents() {
      document.addEventListener('onReceiveAd', function () {
        logger.debug('[ads] Received Ads.');
      });
      document.addEventListener('onFailedToReceiveAd', function (data) {
        logger.debug('[ads] Failed to received Ads. Data: ' + JSON.stringify(data));
      });
      document.addEventListener('onPresentAd', function () {
        logger.debug('[ads] Present Ads.');
      });
      document.addEventListener('onDismissAd', function () {
        logger.debug('[ads] Dismess Ads.');
      });
      document.addEventListener('onLeaveToAd', function () {
        logger.debug('[ads] Leave Ads.');
      });
      document.addEventListener('onReceiveInterstitialAd', function () {
        logger.debug('[ads] Receive Interstitial Ads.');
        mInterstialReceived = true;
      });
      document.addEventListener('onPresentInterstitialAd', function () {
        logger.debug('[ads] Present Interstitial Ads.');

        var lastShow = new Date().getTime();
        config.setConfig(mConst.CfgKeys.LastShow, lastShow);
      });

      document.addEventListener('onDismissInterstitialAd', function () {
        console.log('[ads] On Dismiss INterstitial Al.');
        window.plugins.AdMob.createInterstitialView();			//REMOVE THESE 2 LINES IF USING AUTOSHOW
        window.plugins.AdMob.requestInterstitialAd();			  //get the next one ready only after the current one is closed
      });
    }

    //display the banner
    function showBannerFunc() {
      console.log('[ads] SHOW BANNER.');
      window.plugins.AdMob.createBannerView();
    }

    //display the interstitial
    function showInterstitialFunc() {
      console.log('[ads] SHOW INTERSTITIAL.');
      window.plugins.AdMob.showInterstitialAd();
    }
  }

  ////////////////////////////////////////////////////////////
  //// -- Application initialization
  ////////////////////////////////////////////////////////////

}());
