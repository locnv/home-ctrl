//@LOCN
/* global angular         */
/* global _global           */
/* global cordova         */
/* global FileError       */
/* global LocalFileSystem */
/* global Promise */
(function() {
  'use strict';

  angular.module(_global.AppName)
    .factory('RtStorage', ServiceImpl);

  //ServiceImpl.$inject = [ 'LogService', 'Util'];

  function ServiceImpl() {

    /* Global/Constant */
    var ServiceName = 'rt-storage';

    /* Local variables */

    var mObjects = {};

    var inst = {

      /* Get all files (by application) */
      set: set,
      get: get,
      remove: remove,
      removeAll: removeAll,
    };

    return inst;

    ////// Implementation

    function set(key, value) {
      mObjects[key] = value;
    }

    function get(key) {
      return mObjects[key];
    }

    function remove(key) {
      delete mObjects[key];
    }

    function removeAll() {
      mObjects = {};
    }
  }
})();