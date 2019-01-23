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
  .controller(_global.Controllers.SignUp, ControlerImpl);

  ControlerImpl.$inject = ['$scope', '$controller', 'AppCsf'];

  function ControlerImpl($scope, $controller, AppCsf) {
    var mConst = AppCsf.appConst;
    var log = AppCsf.logger;
    var util = AppCsf.util;
    var i18n = AppCsf.i18n;
    var CtrlName = _global.Controllers.SignUp;

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