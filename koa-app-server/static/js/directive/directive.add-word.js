(function() {
  'use strict';

  /* global angular */
  /* global _global */
  angular.module(_global.AppName)
    .directive('addWord', DirectiveImpl);

  DirectiveImpl.$inject = [ ];
  function DirectiveImpl() {

    return {
      restrict: 'E',

      scope: {
        cardId: '@',
      },

      compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, iElem, iAttrs) {
          },
          post: function(scope, iElem, iAttrs) {

            scope.$watch('cardId', function(c1, c2) {
              console.log('Card change > ' + scope.cardId);
            });
          }
        };
      },
      templateUrl: './html/partial/add-word.html',
      controller: DirectiveCtrl,
    };
  }

  DirectiveCtrl.$inject = [ '$scope', 'DIC', 'AppCsf', 'HttpComm' ];
  function DirectiveCtrl($scope, dic, AppCsf, httpComm) {

    /* Constants */

    /* Local variables */

    var util = AppCsf.util;
    var logger = AppCsf.logger;

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

    function onBtnAddClicked(word) {
      if(util.isNullOrUndefined(word) || util.isNullOrEmpty(word.name)) {
        logger.warn('[add-word] > name is empty!');
        return;
      }

      console.log('adding new word: ' +JSON.stringify(word) +' into card ' + $scope.cardId);
      httpComm.addNewWord($scope.cardId, word.name, word.description, word.example)
      .then(function(resp) {
        console.log('add result: ' +JSON.stringify(resp));
      });

    }

  }

})();
