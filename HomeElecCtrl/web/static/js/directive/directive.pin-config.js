(function() {
  'use strict';

  /* global angular */
  /* global _global */
  angular.module(_global.AppName)
  .directive('pinConfig', DirectiveImpl);

  DirectiveImpl.$inject = [ 'LogService' ];
  function DirectiveImpl(logger) {

    return {
      restrict: 'E',

      scope: {
        pin: '='
      },

      compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, iElem, iAttrs) {
          },
          post: function(scope, iElem, iAttrs) {
          }
        };
      },
      templateUrl: './html/partial/pin-config.html',
      controller: DirectiveCtrl,
    };
  }

  function DirectiveCtrl($scope, $element, $attrs) {

    /* Constants */

    /* Local variables */

    /* Scope variable */

    $scope.id = new Date().getTime();

    /* Scope functions */

    /* Entry */
    initialize();

    ///////////////////////////////
    //// Implementation
    ///////////////////////////////

    function initialize() {
      //console.log('NavigatorButton>Initialize.');
    }

  }

})();
