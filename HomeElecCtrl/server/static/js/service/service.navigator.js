//@LOCN
/* global angular */
/* global _global */
(function() {
  'use strict';

  angular.module(_global.AppName)
  .factory('AppNavigator', AppNavigator);

  AppNavigator.$inject = [ '$rootScope', '$location', '$route', 'LogService', 'AppConstants'];

  function AppNavigator($rootScope, $location, $route, LogService, AppConstants) {

    let history = [];
    let log = LogService;

    let HomePath = AppConstants.Routes.Home;

    let inst = {
      /* Go to a specific page */
      gotoPage: gotoPage,

      /* Go to previous page */
      gotoPreviousPage: gotoPreviousPage,

      /* Go to home page */
      gotoHomePage: gotoHomePage,

      /* Test if is being at a page */
      isPage: isPage,

      /* Test if is being at home page */
      isHomePage: isHomePage,

      /* Return current route */
      getCurrentPage: getCurrentPage,

      /*  */
    };

    return inst;

    ////// Implementation

    function isPage(route) {
      let currentPath = $location.path();
      return (currentPath && (currentPath.indexOf(route) !== -1));
    }

    function isHomePage() {
      return isPage(HomePath);
    }

    function getCurrentPage() {
      return $location.path();
    }

    /**
     * Go to a specified page by a path. The path is one of Constants.Routes
     *
     * @param path [string] required & different from current path
     *   @See Constants.Routes
     * @param params parameters
     * @param trace either or not put current page into history list
     */
    function gotoPage(path, params, trace) {
      let currentPath = $location.path();
      log.info('[app-nav] gotoPage. currentPath: ' + currentPath);
      if(!path) {
        return;
      }

      if(path === currentPath) {
        return;
      }

      if(trace === undefined) {
        trace = true;
      }

      log.debug('[nav] Current: ' +currentPath + '; Target: ' +path +
        '; Parameters: ' +JSON.stringify(params));

      // Save current path for navigating back
      if(currentPath && trace) {
        history.push({
          path: currentPath,
        });
      }

      let scope = $route.current.locals.$scope;
      let p = null;
      if(scope && scope.leaving && typeof scope.leaving === 'function') {
        p = scope.leaving();
      }

      if(p !== null && !angular.isUndefined(p) && angular.isObject(p) && (typeof p.then === 'function')) {
        let mLeavingTO = setTimeout(function() {
          log.warn('Leaving takes too long.');
          applyPath(path, params);

          mLeavingTO = null;
        }, 30000);

        p.then(function(rs) {
          if(mLeavingTO !== null) {
            clearTimeout(mLeavingTO);
            mLeavingTO = null;

            applyPath(path, params);
          } // Else, if mLeavingTO is NULL, that always means new path already applied.
        });
      } else {
        applyPath(path, params);
      }
    }

    function gotoPreviousPage() {
      if(history.length <= 0) {
        return;
      }

      let target = history.pop();
      let path = target.path;
      log.info('[app-nav] gotoPreviousPage. currentPath: ' + $location.path());

      gotoPage(path, null, false);
    }

    function gotoHomePage() {
      if(isHomePage()) {
        return;
      }

      history = [];
      gotoPage(HomePath, null, false);
    }

    function applyPath(path, params) {
      let loc = $location.path(path);
      if(!angular.isUndefined(params) && params !== null && typeof params === 'object') {
        loc.search(params);
      }

      if(!$rootScope.$$phase) {
        $rootScope.$apply();
      }
    }
  }
})();
