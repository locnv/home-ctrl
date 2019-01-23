(function() {
  'use strict';

  // ref https://www.npmjs.com/package/cordova-clipboard
  /* global angular */
  /* global _global */
  /* global Companies */
  angular.module(_global.AppName)
    .directive('bleClipboard', BleClipboardDirective);

  /* Directive */
  BleClipboardDirective.$inject = [ 'LogService' ];
  function BleClipboardDirective(LogService) {

    var log = LogService;

    return {
      restrict: 'E',

      scope: {
        //rawData: '=',
      },

      compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, iElem, iAttrs) {
          },
          post: function(scope, iElem, iAttrs) {
            scope.initialize();
          }
        };
      },
      template: '<div class="ble-clipboard">C</div>',

      controller: BleClipboardController,
    };
  }

  BleClipboardController.$injector = [ '$scope', 'AppCsf'];
  function BleClipboardController($scope, AppCsf) {

    /* Constants */


    /* Local variables */
    var util = AppCsf.util;

    /* Scope variable */

    /* Scope functions */
    $scope.initialize = initialize;

    ///////////////////////////////
    //// Implementation
    ///////////////////////////////

    function initialize() {
    }

  }

})();
