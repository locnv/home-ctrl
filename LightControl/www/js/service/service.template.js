/*jshint esversion: 6 */
/* global angular */
/* global _global */
(function() {
  'use strict';

  angular.module(_global.AppName)
    .factory('ServiceName', ServiceImpl);

  ServiceImpl.$inject = [ ];

  function ServiceImpl( ) {

    var mInitialized = false;

    var inst = {
      initialize: initialize,
      isInitialized: isInitialized,
    };

    return inst;

    /**
     * Initialization
     *
     * @return {Promise}
     */
    function initialize() {
      var promise = new Promise(function(resolve, reject) {
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

  }
})();