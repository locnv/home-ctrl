/*jshint esversion: 6 */
/* global angular */
/* global _global */
(function() {
  'use strict';

  angular.module(_global.AppName)
  .factory('HttpComm', ServiceImpl);

  ServiceImpl.$inject = [ '$http', 'Util', 'LogService' ];

  function ServiceImpl( $http, util, logger ) {

    let Host = util.Remote.Host;

    let Api = {
      ElecCtrl: '/elec_ctrl'
    };
    let Actions = {
      CmdSwitch: 8,
    };

    let RequestType = {
      Get: 'get',
      Post: 'post',
      Put: 'put',
      Delete: 'delete',
    };

    let Errors = {
      NoError: 0,
      ServerError: 1,
    };

    let mInitialized = false;

    let inst = {
      Errors: Errors,

      initialize: initialize,
      isInitialized: isInitialized,

      // Home Elec Control
      sendSwitchCommand: sendSwitchCommand,
      scheduleSwitch: scheduleSwitch,

      sendRequest: sendRequest,
    };

    return inst;

    /**
     * Initialization
     *
     * @return {Promise}
     */
    function initialize() {
      let promise = new Promise(function(resolve, reject) {
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

      return promise;
    }

    function isInitialized() {
      return mInitialized;
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

      return sendRequest(RequestType.Post, Host, Api.ElecCtrl, params);
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

      return sendRequest(RequestType.Post, Host, Api.ElecCtrl, params);
    }

    /**
     *
     * @param reqType
     * @param host
     * @param api
     * @return {Promise}
     */
    function sendRequest(reqType, host, api, param) {
      let Fn = $http.get;

      switch (reqType) {
        case RequestType.Get:
          break;

        case RequestType.Post:
          Fn = $http.post;
          break;

        case RequestType.Put:
          Fn = $http.put;
          break;

        case RequestType.Delete:
          Fn = $http.delete;
          break;

        default:
          break;
      }

      let promise = new Promise(function(resolve, reject) {
        let url = host + api;
        logger.debug('url > ' + url);

        let args = [url];
        if(param) {
          args.push(param);
        }

        Fn.apply($http, args)
        .then(function(resp) {
          resolve(resp);
        })
        .catch(handleError.bind(null, reject));
      });

      return promise;
    }

    function handleError(next, err) {
      logger.error(err);

      if(next) {
        next.call(err);
      }
    }

  }
})();
