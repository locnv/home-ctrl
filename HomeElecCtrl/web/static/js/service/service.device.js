/*jshint esversion: 6 */
/* global angular */
/* global _global */
(function() {
  'use strict';

  angular.module(_global.AppName)
  .factory('DevService', ServiceImpl);

  ServiceImpl.$inject = [ 'HttpComm', 'Util', 'LogService' ];

  function ServiceImpl( http, util, logger ) {

    const RespStatus = http.ResponseStatus;

    let Api = {
      ListDevice: '/api/dev/list',
      AddDevice: '/api/dev/add',

      SwitchStatus: '/api/dev/{0}/{1}', // /api/dev/:id/:status
      SwitchesStatus: '/api/dev/config'
    };

    let mInitialized = false;

    return {
      initialize: initialize,
      isInitialized: isInitialized,

      getAllDevices: getAllDevices,
      addDevice: addDevice,

      sendSwitchCommand: sendSwitchCommand,
      sendSwitchesCommand: sendSwitchesCommand,
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
        .then(resp => resp.status === RespStatus.Ok ? resolve(resp.data) : reject(new Error(resp.message)))
        .catch(err => {
          logger.error('Failed to get devices list', err);
          reject.bind(null, new Error('Server error. See log for more detail.'));
        });
      });
    }

    function addDevice(dev) {
      return new Promise((resolve, reject) => {
        http.sendPostRequest(Api.AddDevice, dev)
        .then(resp => resp.status === RespStatus.Ok ? resolve(resp.data) : reject(new Error(resp.message)))
        .catch(err => {
          logger.error('Failed to add device', err);
          reject.bind(null, new Error('Server error. See log for more detail.'));
        });
      });
    }

    function sendSwitchCommand(switchId, status) {
      logger.debug(`[http] > sendSwitchCommand: switch ${switchId} > ${status}`);

      return new Promise((resolve, reject) => {
        let path = Api.SwitchStatus.format(switchId, status);
        http.sendPostRequest(path, {})
        .then(resp => resp.status === RespStatus.Ok ? resolve(resp.data) : reject(new Error(resp.message)))
        .catch(err => {
          logger.error('Failed to get devices list', err);
          reject.bind(null, new Error('Server error. See log for more detail.'));
        });
      });

    }

    function sendSwitchesCommand(switchesConf) {

      logger.debug(`[http] > sendSwitchesCommand: configuration ${JSON.stringify(switchesConf)}`);

      return new Promise((resolve, reject) => {

        http.sendPostRequest(Api.SwitchesStatus, switchesConf)
        .then(resp => resp.status === RespStatus.Ok ? resolve(resp.data) : reject(new Error(resp.message)))
        .catch(err => {
          logger.error('Failed to configure', err);
          reject.bind(null, new Error('Server error. See log for more detail.'));
        });
      });

    }


  }
})();
