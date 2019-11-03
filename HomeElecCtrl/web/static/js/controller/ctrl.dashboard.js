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

  /**
   * Dashboard Controller
   *
   * Present devices map
   * Allow to construct a device status map and send to backend.
   *
   * @param $scope
   * @param $controller
   * @param devService
   * @param AppCsf
   * @constructor
   */
  function ControllerImpl($scope, $controller, devService, AppCsf) {
    let mConst = AppCsf.appConst;
    let log = AppCsf.logger;
    let util = AppCsf.util;
    let i18n = AppCsf.i18n;
    let notifier = AppCsf.notifier;
    /* Scope variables */
    $scope.CtrlName = _global.Controllers.Dashboard;
    $scope.PageTitle = 'Dashboard';

    $scope.SwitchStatus = mConst.SwitchStatus;
    $scope.devices = [];

    $scope.onEntering = onEntering;
    $scope.onLeaving = onLeaving;
    $scope.onResume = onResume;
    $scope.onLanguageChanged = onLanguageChanged;

    $scope.toggleSwitch = toggleSwitch;
    $scope.applySystemConfig = applySystemConfig;
    $scope.configCheckboxToggle = configCheckboxToggle;

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

    function onResume() { }

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

    function toggleSwitch(dev) {
      let nextStatus = $scope.SwitchStatus.On;
      if(nextStatus === dev.status) {
        nextStatus = $scope.SwitchStatus.Off;
      }

      devService.sendSwitchCommand(dev.id, nextStatus)
      .then(rs => {
        dev.status = nextStatus;
        notifier.notify('Command is sent.');

        $scope.safeApply();
      })
      .catch(err => {
        log.error('Failed to send switch status command', err);
        notifier.error('Failed to send switch status. See log for detail.');
      });
    }

    function applySystemConfig() {
      let devConf = $scope.devices.map(dev => {
        return {
          id: dev.id,
          status: dev.status1 ? $scope.SwitchStatus.On : $scope.SwitchStatus.Off }
      });

      devService.sendSwitchesCommand(devConf)
      .then(rs => {
        notifier.notify('Command is sent.');
        // $scope.safeApply();
      })
      .catch(err => {
        log.error('Failed to send switches status command', err);
        notifier.error('Failed to send switches status. See log for detail.');
      });
    }

    function configCheckboxToggle($event, dev) {
      log.info('Checkbox change.');
      log.info($event);
      log.info(dev);
    }

    function onLanguageChanged() { }
  }
})();
