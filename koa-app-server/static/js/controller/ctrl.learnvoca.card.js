/**
 * Created by locnv on 1/21/18.
 *
 */

/* global angular */
/* global bluetoothle */
/* global _global */
/* global Promise */
/* global $ */
(function() {
  'use strict';

  angular
  .module(_global.AppName)
  .controller(_global.Controllers.Card, ControlerImpl);

  ControlerImpl.$inject = ['$scope', '$controller', 'DIC', 'AppCsf'];

  function ControlerImpl($scope, $controller, dic, AppCsf) {
    var mConst = AppCsf.appConst;
    var log = AppCsf.logger;
    var util = AppCsf.util;
    var fileStorage = AppCsf.fileStorage;
    var i18n = AppCsf.i18n;
    var dic = AppCsf.dic;
    var CtrlName = _global.Controllers.Card;
    var ModalAddWordId = '#modelAddWord';

    /* Scope variables */
    $scope.CtrlName = CtrlName;
    $scope.PageTitle = 'Card';
    $scope.card = {};

    $scope.onEntering = onEntering;
    $scope.onLeaving = onLeaving;
    $scope.onResume = onResume;
    $scope.onLanguageChanged = onLanguageChanged;
    $scope.toggleFormCreateWord = toggleFormCreateWord;

    /* Extend from base controller */
    $controller('BaseCtrl', { $scope: $scope });

    /**
     * Entering
     *
     * @returns {Promise.<boolean>}
     */
    function onEntering() {
      initialize();

      return Promise.resolve(true);
    }

    function onLeaving() {

      return Promise.resolve(true);
    }

    function onResume() {

    }

    /**
     * Page initialization
     */
    function initialize() {
      var cardId = $scope.getUrlParam('cardId');
      $scope.card = dic.getCardById(cardId);

      if($scope.card && !$scope.card.words) {
        dic.getWords($scope.card.id)
        .then(function(words) {
          $scope.card.words = words;
          $scope.$digest();
        });
      }
    }

    function onLanguageChanged() {
      //btnFooterLeft.caption = getBtnStartStopText();
      //btnFooterRight.caption = i18n.translate('static.FILTER');
    }

    function toggleFormCreateWord() {
      $(ModalAddWordId).modal({});
    }

  }
})();