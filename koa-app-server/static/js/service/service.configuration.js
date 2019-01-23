/* jshint esversion: 6  */
/* global angular       */
/* global console       */
/* global _global       */
(function() {
  'use strict';

  angular.module(_global.AppName)
    .factory('Config', Config);

  Config.$inject = [ 'FileStorage'];

  function Config(FileStorage) {
    var ConfigFileName = 'learn-voca-config.ini';
    var DefaultConfig = {
      'app.sessions.values': [0], // appStartCounter/.... TBD
      'language': 'en_US',
    };
    var Keys = {
      Language: 'language',
    };

    var fileStorage = FileStorage;
    var config = {};
    var doInit = false;

    var inst = {
      Constants: Keys,
      initialize: initialize,
      getString: getString,
      getInt: getInt,
      getBool: getBool,
      setConfig: setConfig,
      dumpAllConfig: dumpAllConfig,
      getAppStartCounter: getAppStartCounter,
    };

    return inst;

    ////// Implementation

    /**
     * Initialize
     */
    function initialize() {
      var promise = new Promise(function(resolve, reject) {
        internal_initialize(resolve, reject);
      });

      function internal_initialize(_resolve, _reject) {
        if(doInit) {
          console.debug('[config] Config service already initialized.');
          setTimeout(_resolve, 1);
          return;
        }

        doInit = true;
        console.debug('[config] Initialize.');

        //fileStorage.checkFileExist(ConfigFileName, function(isExist) {
        //  if(isExist) {
        fileStorage.readFromFile(ConfigFileName)
        .then(function(cfgObj) {
          config = cfgObj || {};
          setTimeout(writeConfig, 1);
          _resolve(true);
        })
        .catch(function(err) {
          config = DefaultConfig;
          writeConfig();
          _resolve(true);
        });
       //   } else {
       //     config = DefaultConfig;
       //     writeConfig();
       //     _resolve(true);
       //   }
       // });
      }

      return promise;

    }

    /**
     * Write config object to file.
     */
    function writeConfig() {
      fileStorage.writeToFile(ConfigFileName, config)
      .then(function(rs) {
        //console.debug('[config] Write config done. Result: ' + JSON.stringify(rs));
      });
    }

    /**
     * Get String configured value
     * @param key key
     * @param def default value
     */
    function getString(key, def) {
      var value = config[key];
      if(value === undefined || value === null || value.length === 0) {
        if(def) {
          value = def;

          config[key] = value;
          writeConfig();
        }
      }

      //else {
      //  value = null;
      //}

      return value;
    }

    /**
     * Get Int configured value
     * @param key key
     * @param def default value
     */
    function getInt(key, def) {
      var value = config[key];
      if(!value) {
        if(def) {
          value = def;

          config[key] = value;
          writeConfig();
        }
      }

      console.debug('[config] GetInt: key: ' +key +': ' + value );
      //console.debug('[config] AllConfig: ' +JSON.stringify(config));

      return value;
    }

    /**
     * Get boolean configured value
     * @param key key
     * @param def default value.
     */
    function getBool(key, def) {
      // TODO to be implemented.
    }

    function setConfig(key, value) {
      config[key] = value;
      writeConfig();
    }

    /**
     * Get app start counter
     * @returns {number}
     */
    function getAppStartCounter() {
      var counter = 0;

      return counter;
    }

    /**
     *
     */
    function dumpAllConfig() {
      //console.log('[config] All config: ' +JSON.stringify(config));
    }

  }
})();