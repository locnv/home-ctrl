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

    let Methods = {
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

    return {
      Errors: Errors,

      ResponseStatus: {
        Ok: 'ok',
        Nok: 'nok'
      },

      initialize: initialize,
      isInitialized: isInitialized,

      sendGetRequest: sendGetRequest,
      sendPostRequest: sendPostRequest,
      sendRequest: sendRequest,
    };

    ///////////////////////////////////////////////
    ///////////////  Implementation ///////////////
    ///////////////////////////////////////////////
    /**
     * Initialization
     *
     * @return {Promise}
     */
    function initialize() {
      return new Promise((resolve, reject) => {
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

    function sendGetRequest(api, param) {
      return this.sendRequest(Methods.Get, api, param);
    }

    function sendPostRequest(api, param) {
      return this.sendRequest(Methods.Post, api, param);
    }

    /**
     *
     * @param method
     * @param api
     * @param param
     * @return {Promise}
     */
    function sendRequest(method, api, param) {
      let Fn = $http.get;

      switch (method) {
        case Methods.Get:
          break;

        case Methods.Post:
          Fn = $http.post;
          break;

        case Methods.Put:
          Fn = $http.put;
          break;

        case Methods.Delete:
          Fn = $http.delete;
          break;

        default:
          break;
      }

      return new Promise(function(resolve, reject) {
        let url = Host + api;
        logger.debug('url > ' + url);

        let args = [url];
        if(param) {
          args.push(param);
        }

        Fn.apply($http, args)
        .then(function(resp) {
          if(resp.status !== 200) {
            logger.error('En error occurs while sending request to server', resp);
            reject(new Error('Server error.'));
          } else {
            resolve(resp.data);
          }
        })
        .catch(handleError.bind(null, reject));
      });

    }

    function handleError(next, err) {
      logger.error(err);

      if(next) {
        next.call(err);
      }
    }

  }
})();
