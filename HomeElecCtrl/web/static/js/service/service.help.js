/*jshint esversion: 6 */
/* global angular */
/* global _global */
(function() {
  'use strict';

  //Helpers.$inject = [ 'LogService'];
  let HelpIds = {
    Hello: 0x01,
    AppInfo: 0x02,
  };

  let HelpMessageTable = [];
  HelpMessageTable[HelpIds.Hello] = 'Hello world!';
  HelpMessageTable[HelpIds.AppInfo] = 'Ble Scanner - v1.0.1!';

  angular.module(_global.AppName)
    .constant('HelpId', HelpIds)
    .factory('Helpers', Helpers);

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
