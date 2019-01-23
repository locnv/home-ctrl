(function() {
  'use strict';

  /* global angular */
  /* global _global */
  angular.module(_global.AppName)
    .directive('bleHeader', DirectiveImpl);

  DirectiveImpl.$inject = [ ];
  function DirectiveImpl() {

    return {
      restrict: 'AE',

      scope: {
      },

      compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, iElem, iAttrs) {
          },
          post: function(scope, iElem, iAttrs) {
          }
        };
      },

      templateUrl: './html/partial/header.html',

      controller: DirectiveControllerImpl,
    };
  }

  function DirectiveControllerImpl($scope, $element, $attrs) {

    /* Constants */

    /* Local variables */

    /* Scope variable */

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
