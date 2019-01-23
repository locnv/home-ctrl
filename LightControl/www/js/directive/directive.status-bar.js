(function() {
  'use strict';

  /* global angular */
  /* global _global */
  angular.module(_global.AppName)
    .directive('statusBar', StatusBarDirective);

  /* Directive */
  StatusBarDirective.$inject = [ 'LogService' ];
  function StatusBarDirective(LogService) {

    var log = LogService;

    return {
      restrict: 'E',

      scope: {
        /**
         * Present application's status
         * {
         *  isError: boolean
         *  message: string
         *  activated: boolean
         * }
         */
        appStatus: '=',
      },

      compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, iElem, iAttrs) {
          },
          post: function(scope, iElem, iAttrs) {
            if(scope.appStatus.isError === null || scope.appStatus.isError === 'undefined') {
              scope.appStatus.isError = false;
            }

            if(scope.appStatus.activated === null || scope.appStatus.activated === 'undefined') {
              scope.appStatus.activated = false;
            }
          }
        };
      },

      template: '<div class="row btx-status-bar btx-ani" ' +
        'ng-class="{\'error\': appStatus.isError, \'no-error\': !appStatus.isError }"'+
        'ng-if="appStatus.activated && appStatus.message.length>0">{{appStatus.message}}</div>',

      controller: StatusBarController,
    };
  }

  //StatusBarController.$injector = ['LogService']
  function StatusBarController($scope, $element, $attrs) {

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
    }

  }

})();
