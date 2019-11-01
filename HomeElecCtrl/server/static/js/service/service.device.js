/*jshint esversion: 6 */
/* global angular */
/* global _global */
(function() {
  'use strict';

  angular.module(_global.AppName)
  .factory('DevService', ServiceImpl);

  ServiceImpl.$inject = [ 'HttpComm', 'Util', 'LogService' ];

  function ServiceImpl( http, util, logger ) {

    let Api = {
      ListDevice: '/api/dev/list'
    };

    let Actions = {
      CmdSwitch: 8,
    };

    let mInitialized = false;

    return {
      initialize: initialize,
      isInitialized: isInitialized,

      getAllDevices: getAllDevices,
      sendSwitchCommand: sendSwitchCommand,
      scheduleSwitch: scheduleSwitch
    };

    /**
     * Initialization
     *
     * @return {Promise}
     */
    function initialize() {
      return new Promise(function(resolve, reject) {
        internal_initialize(resolve, reject);
      });

      function internal_initialize(_resolve, _reject) {
        if(mInitialized) {
          setTimeout(_resolve, 1);
          return;
        }

        mInitialized = true;
        setTimeout(_resolve, 1);
      }
    }

    function isInitialized() {
      return mInitialized;
    }

    function getAllDevices() {

      return new Promise((resolve, reject) => {
        http.sendGetRequest(Api.ListDevice, {})
        .then(resp => {
          resp.status === 'ok' ? resolve(resp.data) : reject(new Error(resp.message));
        })
        .catch(err => {
          logger.error('Failed to get devices list', err);
          reject.bind(null, new Error('Server error. See log for more detail.'));
        });
      });
    }

    // Home Elec Control
    function sendSwitchCommand(target, switchId, command) {
      logger.debug('[http] > sendSwitchCommand: switch ' + switchId + ' > ' + command);
      let params = {
        data: {
          target: target,
          switchId: switchId,
          command: command
        },
        Action: Actions.CmdSwitch
      };

      return http.sendPostRequest(Api.ElecCtrl, params);
    }

    // Not done yet!
    function scheduleSwitch(target, switchId, command, delay) {
      logger.debug('[http] > scheduleSwitch: switch ' + switchId + ' > ' + command + '>' + delay);
      let params = {
        data: {
          target: target,
          switchId: switchId,
          command: 'schedule',
          subCommand: command,
          delay: delay
        },
        Action: Actions.CmdSwitch
      };

      return http.sendPostRequest(Api.ElecCtrl, params);
    }

  }
})();
