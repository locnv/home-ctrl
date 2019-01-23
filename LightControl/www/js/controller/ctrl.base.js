//@LOCN
/* global angular */
/* global _global   */
/* global Promise */
/* global $       */
(function() {
  'use strict';

  angular
    .module(_global.AppName)
    .controller(_global.Controllers.Base, ControllerImpl);

  ControllerImpl.$inject = [ '$scope', '$rootScope', '$location', 'AppCsf' ];
  function ControllerImpl($scope, $rootScope, $location, AppCsf ) {

    var log = AppCsf.logger;
    var Routes = AppCsf.appConst.Routes;

    /* Var internal variables */
    var CtrlName = $scope.CtrlName || _global.Controllers.Base;
    var mMVC = $scope.MVC || null;
    // Definition of Global context menu
    // @type: nav - a navigator button
    //        button - common button
    // @text [string] the menuitem's displaying
    // @me callback's context
    // @config: detail configuration for the menuitem's navigation
    var gCtxMenu = [
      {
        type: 'nav',
        text: 'Setting',
        me: $rootScope,
        config: {
          route: Routes.Setting,
          params: {},
        }
      }, {
        type: 'nav',
        text: 'Test',
        me: $rootScope,
        config: {
          route: Routes.Test,
        }
      }, {
        type: 'nav',
        text: 'About',
        me: $rootScope,
        config: {
          route: Routes.About,
        }
      }
    ];

    var btnToggleFav = {
      caption: '',
      active: true,
      enabled: true,
      icon: 'glyphicon glyphicon-star',
      onClickedHandle: $rootScope.toggleFavPanel,
      context: $scope,
    };

    var urlParams = null;
    var mDeregisters = [];

    /* Global */
    $scope.isDev = (AppCsf.appConst.ENV === 'dev');
    $scope.instantMessages = {};
    $rootScope.gCtxMenu = [];
    $rootScope.onGlobalMenuItemClicked = onGlobalMenuItemClicked;
    /* Scope variables */

    /* Scope functions */
    $scope.leaving = leaving;
    $scope.entering = entering;
    $scope.safeApply = safeApply;
    $scope.setStatusBarMessage = setStatusBarMessage;
    $scope.reportSysWarn = reportSysWarn;
    $scope.setFooterButton = setFooterButton;
    $scope.getUrlParam = getUrlParam;
    $scope.showHelp = showHelp;
    $scope.setPageSubTitle = setPageSubTitle;

    /* Controller entry */
    initialize();

    /* Implementation - Public */

    /* Implementation - Local */
    function initialize() {
      var showLoading  = (typeof $scope.dontShowLoading === 'undefined' || $scope.dontShowLoading === false);
      if(showLoading && !$rootScope.pageLoading) {
        safeApply(function() {
          $rootScope.pageLoading = true;
        });
      }

      if(!_global.deviceReady) {
        log.debug(CtrlName + 'Waiting for device ready!');
        setTimeout(function() {
          initialize();
        }, 1000);
        return;
      }

      // Disable footer
      $rootScope.AppFooter.btnLeft.active = false;
      $rootScope.AppFooter.btnRight.active = false;
      $rootScope.AppFooter.btnMiddle.active = false;

      var FooterConst = AppCsf.appConst.Footer;
      $scope.setFooterButton(btnToggleFav, FooterConst.Middle);

      entering()
      .then(buildGlobalContextMenu);
    }

    /*function registerMVC() {
      if(mMVC === null) {
        return;
      }

      $routeProvider.when(mMVC.route, {
        templateUrl: mMVC.template,
        controller: mMVC.ctrl,
      });
    }*/

    /**
     * Last function shall be called when leaving from a view
     * @returns {*}
     */
    function leaving() {
      var ret = null;
      document.removeEventListener("resume", appResume);

      for(var i = 0; i < mDeregisters.length; i++) {
        mDeregisters[i].call(null);
      }
      mDeregisters = [];

      var showLoading  = (typeof $scope.dontShowLoading === 'undefined' || $scope.dontShowLoading === false);
      if(showLoading) {
        safeApply(function() {
          $rootScope.pageLoading = true;
        });
      }

      //log.debug(CtrlName,'[base] Leaving page > 1.>pageLoading', $rootScope.pageLoading);
      if($scope.onLeaving) {
        ret = $scope.onLeaving();
      }

      if(ret === null || angular.isUndefined(ret) ||
        !angular.isObject(ret) || !ret.then || (typeof ret.then !== 'function')) {

        log.debug(CtrlName, '[base] Leaving page.');
        return Promise.resolve(true);
      }

      return new Promise(function(resolve, reject) {
        ret.then(function(status) {
          log.debug(CtrlName, '[base] Leaving page.');
          resolve(true);
        });
      });
    }

    /**
     * First function shall be called when loading a view
     * @returns {*}
     */
    function entering() {
      log.debug(CtrlName + ' Entering ....');
      var ret = null;
      urlParams = $location.search() || {};

      document.addEventListener("resume", appResume, false);
      var deregister = $rootScope.$on('$translateChangeSuccess', onLanguageChanged);
      mDeregisters.push(deregister);

      checkAndHideBtnToggleFav();

      if($scope.onEntering) {
        ret = $scope.onEntering();
      }

      if(ret === null || angular.isUndefined(ret) ||
        !angular.isObject(ret) || !ret.then || (typeof ret.then !== 'function')) {

        log.debug(CtrlName, '[base] Entering page.');
        $rootScope.pageLoading = false;
        $rootScope.AppInfo.PageTitle = $scope.PageTitle || '';
        return Promise.resolve(true);
      }

      return new Promise(function(resolve, reject) {
        ret.then(function(status) {
          log.debug(CtrlName + '>Entering page.');
          $rootScope.pageLoading = false;
          $rootScope.AppInfo.PageTitle = $scope.PageTitle || '';
          resolve(true);
        });
      });
    }

    function checkAndHideBtnToggleFav() {
      var appNavigator = AppCsf.navigator;
      if(appNavigator.isPage(Routes.Home)) {
        return;
      }

      $rootScope.AppFooter.btnMiddle.active = false;
    }

    function onLanguageChanged() {
      log.debug(CtrlName, 'Language changed!');

      if($scope.I18nRes) {
        var i18n = AppCsf.i18n;
        var i18nRes = $scope.I18nRes;
        for(var i = 0; i < i18nRes.length; i++) {
          var key = i18nRes[i], params = [];
          if(typeof key === 'object') {
            var target = key;
            key = target.Key;
            params.push(target.Params);
          }

          params.unshift(key);
          $scope.instantMessages[key] = i18n.translate.apply(i18n, params);
        }

        log.info($scope.CtrlName + ' > instant message > ' +JSON.stringify($scope.instantMessages));
      }

      if(typeof $scope.onLanguageChanged === 'function') {
        $scope.onLanguageChanged();
      }
    }

    function appResume() {
      log.debug(CtrlName, 'App resume!');

      if(typeof $scope.onResume === 'function') {
        $scope.onResume();
      }
    }

    //function toggleFavPanel() {
    //  $('#sidebar, #content').toggleClass('active');
    //  $('.collapse.in').toggleClass('in');
    //  $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    //}

    function safeApply(fn) {
      $rootScope.safeApply(fn);
    }

    function setStatusBarMessage(message, isError) {
      safeApply(function() {
        $rootScope.setStatusBarMessage(message, isError);
      });
    }

    function reportSysWarn(msg) {
      $rootScope.WARN.report(msg);
    }

    /**
     *
     * @param button
     *  {
     *    active: true,
     *    enabled: true,
     *    caption: 'Back',
     *    icon: '',
     *    onClickedHandle: null,
     *    context: null,
     *  },
     * @param pos {number} can be Footer.Left | Footer.Middle | Footer.Right
     */
    function setFooterButton(button, pos) {
      var FooterConst = AppCsf.appConst.Footer;
      var appFooter = $rootScope.AppFooter;
      switch (pos) {
        case FooterConst.Left:
          appFooter.btnLeft = button;
          break;

        case FooterConst.Middle:
          appFooter.btnMiddle = button;
          break;

        case FooterConst.Right:
          appFooter.btnRight = button;
          break;
        default:
          break;
      }
    }

    function getUrlParam(key) {
      return urlParams[key];
    }

    function showHelp(helpId) {
      $rootScope.Helper.showHelp(helpId);
    }

    function setPageSubTitle(title) {
      $scope.PageTitle = title;
      $rootScope.AppInfo.PageTitle = title;
    }

    function buildGlobalContextMenu() {
      var items = gCtxMenu;

      if(typeof $scope.getGlobalContextMenu === 'function') {
        var pItems = $scope.getGlobalContextMenu();

        for(var i = 0; i < pItems.length; i++) {
          // Do validate

          //
          items.unshift(pItems[i]);
        }
      }

      safeApply(function() {
        $rootScope.gCtxMenu = items;
      });
    }

    function onGlobalMenuItemClicked(item) {
      var handle = item.config.handle;
      handle.call(item.me);
    }
  }

})();
