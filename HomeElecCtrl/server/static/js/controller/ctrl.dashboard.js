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
  .controller(_global.Controllers.Dashboard, ControllerImpl);

  ControllerImpl.$inject = ['$scope', '$controller', 'DevService', 'AppCsf'];

  function ControllerImpl($scope, $controller, devService, AppCsf) {
    let mConst = AppCsf.appConst;
    let log = AppCsf.logger;
    let util = AppCsf.util;
    let i18n = AppCsf.i18n;
    let notifier = AppCsf.notifier;
    let CtrlName = _global.Controllers.Dashboard;

    /* Scope variables */
    $scope.CtrlName = CtrlName;
    $scope.PageTitle = 'Dashboard';

    $scope.devices = [];

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

      devService.getAllDevices()
      .then(devices => {
        $scope.devices = devices;
        $scope.safeApply();
      })
      .catch(err => {
        log.error('Failed to get all devices', err);
        notifier.error('Failed to load device. See log for detail.');
      });
    }

    function onLanguageChanged() {

    }
  }
})();
