(function() {
  'use strict';

  /* global angular */
  /* global _global */
  angular.module(_global.AppName)
    .directive('navButton', NavigatorButtonDirective);

  NavigatorButtonDirective.$inject = [ 'AppNavigator', 'LogService' ];
  function NavigatorButtonDirective(AppNavigator, LogService) {

    let navigator = AppNavigator;
    let log = LogService;

    return {
      restrict: 'AE',

      scope: {
        navTarget: '@',
        navParam: '@',
        navBack: '@',
        navHome: '@',
      },

      compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, iElem, iAttrs) {
          },
          post: function(scope, iElem, iAttrs) {
            if(typeof scope.navBack === 'string') {
              scope.isBtnBack = scope.$eval(scope.navBack);
            }

            if(typeof scope.navHome === 'string') {
              scope.isBtnHome = scope.$eval(scope.navHome);
            }

            if(typeof scope.navParam === 'string') {
              scope.params = scope.$eval(scope.navParam);
            }

            //log.debug('Nav-Button initialized. Target: ' +
            //  scope.navTarget + '; isBack: ' + scope.navBack + '; isHome: ' +
            //  scope.navHome + '; params: ' +scope.params);

            iElem.bind('click', function() {
              if(scope.isBtnBack === true) {
                if(!navigator.isHomePage()) {
                  navigator.gotoPreviousPage();
                }
              } else if(scope.isBtnHome === true) {
                navigator.gotoHomePage();
              } else if(scope.navTarget) {
                navigator.gotoPage(scope.navTarget, scope.params);
              } else {
                log.warn('[nav-button] > invalid nav-target attr > ' + scope.navTarget);
              }
            });
          }
        };
      },

      /*template: '{{navTarget}}',*/

      /*controller: NavigatorButtonCtrl,*/
    };
  }

  function NavigatorButtonCtrl($scope, $element, $attrs) {

    /* Constants */

    /* Local variables */

    /* Scope variable */

    /* Scope functions */
    $scope.execute = execute;

    /* Entry */
    initialize();

    ///////////////////////////////
    //// Implementation
    ///////////////////////////////

    function initialize() {
      //console.log('NavigatorButton>Initialize.');
    }

    function execute() {
      //let target = $scope.navTarget;
    }

  }

})();
