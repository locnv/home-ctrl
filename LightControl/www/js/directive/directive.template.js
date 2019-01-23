(function() {
  'use strict';

  /* global angular */
  /* global _global */
  angular.module(_global.AppName)
    .directive('templateDirective', DirectiveImpl);

  DirectiveImpl.$inject = [ 'DIC', 'LogService' ];
  function DirectiveImpl(dic, LogService) {

    var log = LogService;

    return {
      restrict: 'E',

      scope: { },

      compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, iElem, iAttrs) {
          },
          post: function(scope, iElem, iAttrs) {
          }
        };
      },
      templateUrl: './html/partial/add-card.html',
      controller: DirectiveCtrl,
    };
  }

  function DirectiveCtrl($scope, $element, $attrs) {

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
