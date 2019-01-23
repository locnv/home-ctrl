(function() {
  'use strict';

  /* global angular */
  /* global _global */
  angular.module(_global.AppName)
    .directive('addCard', DirectiveImpl);

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

  DirectiveCtrl.$inject = [ '$scope', 'HttpComm' ];
  function DirectiveCtrl($scope, httpService) {

    /* Constants */

    /* Local variables */

    /* Scope variable */

    /* Scope functions */

    $scope.onBtnAddClicked = onBtnAddClicked;

    /* Entry */
    initialize();

    ///////////////////////////////
    //// Implementation
    ///////////////////////////////

    function initialize() {
      //console.log('NavigatorButton>Initialize.');
    }

    function onBtnAddClicked(cardName) {
      httpService.addNewCards(cardName, "")
      .then(function(resp) {
        console.log('Created card > ' +JSON.stringify(resp));
      })
      .catch(function(err) {
        console.error(err);
      });
    }

  }

})();
