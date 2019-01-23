/*jshint esversion: 6 */
/* global angular */
/* global _global */
(function() {
  'use strict';

  angular.module(_global.AppName)
    .constant('HelpId', HelpIds)
    .factory('Helpers', Helpers);

  //Helpers.$inject = [ 'LogService'];
  var HelpIds = {
    Hello: 0x01,
    AppInfo: 0x02,
  };

  var HelpMessageTable = [];
  HelpMessageTable[HelpIds.Hello] = 'Hello world!';
  HelpMessageTable[HelpIds.AppInfo] = 'Ble Scanner - v1.0.1!';


  function Helpers() {

    let inst = {
      getHelpMessage: getHelpMessage,
    };

    return inst;

    ////// Implementation

    /**
     * Initialize
     */
    function getHelpMessage(helpId) {
      return HelpMessageTable[helpId];
    }

  }
})();