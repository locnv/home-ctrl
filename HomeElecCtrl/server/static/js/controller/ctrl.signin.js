/**
 * Created by locnv on 1/21/18.
 *
 */

/* global angular */
/* global bluetoothle */
/* global _global */
/* global Promise */
/* global $ */
/* global LoadingCtrl */
(function() {
  'use strict';

  angular
    .module(_global.AppName)
    .controller(_global.Controllers.SignIn, ControllerImpl);

  ControllerImpl.$inject = ['$scope', '$controller', 'AppCsf'];

  function ControllerImpl($scope, $controller, AppCsf) {
    let mConst = AppCsf.appConst;
    let log = AppCsf.logger;
    let util = AppCsf.util;
    let i18n = AppCsf.i18n;
    let CtrlName = _global.Controllers.SignIn;

    /* Scope variables */
    $scope.CtrlName = CtrlName;
    $scope.PageTitle = 'Sign up';

    $scope.onEntering = onEntering;
    $scope.onLeaving = onLeaving;
    $scope.onResume = onResume;
    $scope.onLanguageChanged = onLanguageChanged;

    /* Extend from base controller */
    $controller('BaseCtrl', { $scope: $scope });

    /**
     * Entering
     *
     * @returns {Promise.<boolean>}
     */
    function onEntering() {
      initialize();

      return Promise.resolve(true);
    }

    function onLeaving() {

      return Promise.resolve(true);
    }

    function onResume() {

    }

    /**
     * Page initialization
     */
    function initialize() {
    }

    function onLanguageChanged() {

    }
  }
})();
