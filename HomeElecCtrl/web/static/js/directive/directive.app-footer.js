(function() {
  'use strict';

  /* global angular */
  /* global _global   */
  angular.module(_global.AppName)
  .directive('appFooter', DirectiveImpl);

  DirectiveImpl.$inject = [ ];
  function DirectiveImpl() {

    return {
      restrict: 'AE',

      scope: {
        /* Configure a Button Left, a Right and a Middle */
        config: '=',
      },

      compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, iElem, iAttrs) {
          },
          post: function(scope, iElem, iAttrs) {
            scope.$watch('config.btnLeft', function(cfgAfter, cfgBefore) {
              scope.btnLeft = cfgAfter;
            }, false);

            scope.$watch('config.btnRight', function(cfgAfter, cfgBefore) {
              scope.btnRight = cfgAfter;
            }, false);

            scope.$watch('config.btnMiddle', function(cfgAfter, cfgBefore) {
              scope.btnMiddle = cfgAfter;
            }, false);
          }
        };
      },

      templateUrl: './html/partial/footer.html',

      controller: DirectiveControllerImpl,
    };
  }

  function DirectiveControllerImpl($scope, $element, $attrs) {

    /* Constants */

    /* Local variables */

    /* Scope variable */
    $scope.onBtnLeftClicked = onBtnLeftClicked;
    $scope.onBtnMiddleClicked = onBtnMiddleClicked;
    $scope.onBtnRightClicked = onBtnRightClicked;

    /* Scope functions */

    /* Entry */
    initialize();

    ///////////////////////////////
    //// Implementation
    ///////////////////////////////

    function initialize() {
      //console.log('NavigatorButton>Initialize.');
    }

    function onBtnLeftClicked() {
      var self = $scope.btnLeft.context;
      $scope.btnLeft.onClickedHandle.call(self);
    }

    function onBtnMiddleClicked() {
      var self = $scope.btnRight.context;
      $scope.btnMiddle.onClickedHandle.call(self);
    }

    function onBtnRightClicked() {
      var self = $scope.btnRight.context;
      $scope.btnRight.onClickedHandle.call(self);
    }


  }

})();
