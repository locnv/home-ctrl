(function() {
  'use strict';

  /* global angular */
  /* global _global */
  angular.module(_global.AppName)
    .directive('dirTest', DirectiveImpl);

  DirectiveImpl.$inject = [ '$compile' ];
  function DirectiveImpl($compile) {

    var template = "<button ng-click='doSomething()'>{{label}}{{t}}</button>";

    return {
      restrict: 'AE',
      scope: { },
      link: function(scope, element){
        //var template = "<button ng-click='doSomething()'>{{label}}</button>";
        var linkFn = $compile(template);
        var content = linkFn(scope);
        element.append(content);

        element.on("click", function() {
          scope.t = new Date().getTime();
          scope.$apply(function() {
            var content = $compile(template)(scope);
            element.append(content);
          });
        });

      },
      /*compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, iElem, iAttrs) {
          },
          post: function(scope, iElem, iAttrs) {
            iElem.html("<button ng-click='doSomething()'>{{label}}</button>");
          }
        };
      },*/
      //template:"<button ng-click='doSomething()'>{{label}}</div>",
      controller: DirectiveCtrl,
    };
  }

  DirectiveCtrl.$inject = [ '$scope', 'DIC' ];
  function DirectiveCtrl($scope, dic) {

    /* Constants */

    /* Local variables */

    /* Scope variable */

    $scope.label = 'Hello!';

    /* Scope functions */

    $scope.doSomething = doSomething;

    /* Entry */
    initialize();

    ///////////////////////////////
    //// Implementation
    ///////////////////////////////

    function initialize() {
      //console.log('NavigatorButton>Initialize.');
    }

    function doSomething() {
      console.log('hello word @' + new Date().getTime());
    }

  }

})();
