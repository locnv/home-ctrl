/**
 * Created by locnv on 1/21/18.
 *
 */

/* global angular */
/* global bluetoothle */
/* global _global */
/* global Promise */
/* global MeshParticle */
(function() {
  'use strict';

  angular
  .module(_global.AppName)
  .controller(_global.Controllers.Word, ControlerImpl);

  ControlerImpl.$inject = ['$scope', '$controller', 'DIC', 'AppCsf'];

  function ControlerImpl($scope, $controller, dic, AppCsf) {
    var mConst = AppCsf.appConst;
    var log = AppCsf.logger;
    var util = AppCsf.util;
    var fileStorage = AppCsf.fileStorage;
    var i18n = AppCsf.i18n;
    var CtrlName = _global.Controllers.Word;

    /* Scope variables */
    $scope.CtrlName = CtrlName;
    $scope.PageTitle = 'Word';

    $scope.onEntering = onEntering;
    $scope.onLeaving = onLeaving;
    $scope.onResume = onResume;
    $scope.onLanguageChanged = onLanguageChanged;

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
      var name = $scope.getUrlParam('word');

      $scope.word = dic.getWord(cardId, name);

      //$scope.setFooterButton(btnFooterLeft, mConst.Footer.Left);
      //$scope.setFooterButton(btnFooterRight, mConst.Footer.Right);

    }

    function onLanguageChanged() {
      //btnFooterLeft.caption = getBtnStartStopText();
      //btnFooterRight.caption = i18n.translate('static.FILTER');
    }

  }
})();