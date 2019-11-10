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
  .controller(_global.Controllers.AddDevice, ControllerImpl);

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
    $scope.CtrlName = _global.Controllers.AddDevice;
    $scope.PageTitle = 'Add new device';

    $scope.SwitchStatus = mConst.SwitchStatus;

    //*//*/#* Adding new device *#\\*\\
    /**
     * Device:
     *  id: string -> uuid
     *  name: string
     *  type: string -> switch
     *  pins: Array
     *    [
     *      { pin: 23, name: 'Red', mode: anaglog | xxx, level: 0~255 },
     *      { pin: 23, name: 'Red', mode: anaglog | xxx, level: 0~255 },
     *    ]
     */
    $scope.nDevice = {
      id: '100-0000-123',
      name: 'Eugene',
      devType: 'switch',
      pins: []
    };

    $scope.onEntering = onEntering;
    $scope.onLeaving = onLeaving;
    $scope.onResume = onResume;
    $scope.onLanguageChanged = onLanguageChanged;

    $scope.addNewPin = addNewPin;
    $scope.sendAddDevice = sendAddDevice;

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
    }

    function onLanguageChanged() { }

    function addNewPin() {
      let idx = $scope.nDevice.pins.length + 1;
      $scope.nDevice.pins.push({
        name: `pin-${idx}`,
        pinNb: 0,
        mode: '',
        level: 0
      });
    }

    function sendAddDevice() {

      let dev = $scope.nDevice;

      devService.addDevice(dev)
      .then(() => {
        notifier.notify('Request was sent.');
      })
      .catch(err => {
        log.error('Failed to add device', err);
        let errMessage = err.message || 'Failed to add device. See log for detail.';
        notifier.error(errMessage);
      });
    }
  }
})();
