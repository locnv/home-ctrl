/*jshint esversion: 6 */
/* global angular */
/* global _global */
(function() {
  'use strict';

  angular.module(_global.AppName)
    .factory('I18N', ServiceImpl);

  ServiceImpl.$inject = [ '$translate' ];

  function ServiceImpl( $translate) {

    var Languages = {
      En: 'en_US',
      Vi: 'vn_VN',
      Fr: 'fr_FR',
    };

    var mInitialized = false;
    var mLanguage = Languages.En;

    var inst = {
      Languages: Languages,
      initialize: initialize,
      isInitialized: isInitialized,
      getCurrentLanguage: getCurrentLanguage,
      refresh: refresh,
      setLanguage: setLanguage,
      translate: translate,
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

        mLanguage = 'en_EN'; // config.getString(config.Constants.Language, Languages.En);
        setLanguage(mLanguage);
        mInitialized = true;
        setTimeout(_resolve, 1);
      }

      return promise;
    }

    function isInitialized() {
      return mInitialized;
    }

    function getCurrentLanguage() {
      return mLanguage;
    }

    function refresh() {
      setLanguage(mLanguage);
    }

    function setLanguage(lang) {
      mLanguage = lang;
      $translate.use(mLanguage);
    }

    /**
     * @param arguments [ key - string, params (optional) - object ]
     * @return {*}
     */
    function translate() {
      var nbArgs = arguments.length;
      if(nbArgs === 0 || nbArgs > 2) {
        return "";
      }

      var key = arguments[0];
      if(nbArgs === 1) {
        return $translate.instant(key);
      }

      var params = arguments[1];
      if(typeof params !== 'object') {
        return $translate.instant(key);
      }

      return $translate.instant(key, params);
    }

  }
})();