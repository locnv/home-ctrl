(function() {
  'use strict';

  /* global angular */
  /* global _global */
  /* global Companies */
  angular.module(_global.AppName)
  .directive('appHelper', DirectiveImpl);

  /* Directive */
  DirectiveImpl.$inject = [ 'Helpers' ];
  function DirectiveImpl(helpService) {

    return {
      restrict: 'E',

      scope: {
        active: '=',
        helpId: '=',
      },

      compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, iElem, iAttrs) {
          },
          post: function(scope, iElem, iAttrs) {
            scope.initialize();
            scope.$watch('helpId', function(val1, val2) {
              scope.message = helpService.getHelpMessage(scope.helpId);
            });
          }
        };
      },
      template: '<div class="row app-help">' +
        '<button class="btn-dismiss" ng-click="active=false">-</button>'+
        '{{message}}</div>',

      controller: BleHelperController,
    };
  }

  BleHelperController.$injector = [ '$scope' ];
  function BleHelperController($scope) {

    /* Local variables */

    /* Scope variable */

    /* Scope functions */
    $scope.initialize = initialize;

    /* Entry */
    initialize();

    ///////////////////////////////
    //// Implementation
    ///////////////////////////////

    function initialize() {
      console.log('>Helper activated!');
    }

  }

})();
