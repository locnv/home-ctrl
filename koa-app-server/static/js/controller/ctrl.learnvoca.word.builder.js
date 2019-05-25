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
  .controller(_global.Controllers.WordBuilder, ControlerImpl);

  ControlerImpl.$inject = ['$scope', '$controller', 'DIC', 'AppCsf'];

  function ControlerImpl($scope, $controller, dic, AppCsf) {
    var mConst = AppCsf.appConst;
    var log = AppCsf.logger;
    var util = AppCsf.util;
    var i18n = AppCsf.i18n;
    var notifier = AppCsf.notifier;
    var http = AppCsf.http;
    var CtrlName = _global.Controllers.WordBuilder;

    /* Scope variables */
    $scope.CtrlName = CtrlName;
    $scope.PageTitle = 'Word Builder';

    $scope.onEntering = onEntering;
    $scope.onLeaving = onLeaving;
    $scope.onResume = onResume;
    $scope.onLanguageChanged = onLanguageChanged;

    $scope.onBtnSubmitClicked = onBtnSubmitClicked;
    $scope.onBtnGetAWordClicked = onBtnGetAWordClicked;
    $scope.onBtnBuildWordClicked = onBtnBuildWordClicked;
    $scope.onBtnUpdateImageClicked = onBtnUpdateImageClicked;

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
      log.info('word-builder -> initialized!');
      //var cardId = $scope.getUrlParam('cardId');
      //var name = $scope.getUrlParam('word');

      //$scope.word = dic.getWord(cardId, name);
    }

    function onLanguageChanged() {

    }

    function onBtnUpdateImageClicked(wordId, link) {
      notifier.notify('Going to update image -> ' + wordId + ' -> ' + link);
    }

    function onBtnBuildWordClicked(wordBase) {
      if(wordBase === null || wordBase === undefined) {
        notifier.error('No word to build.');
        return;
      }

      var parts = [wordBase];
      http.buildWords(parts)
        .then(function(resp) {
          var respData = resp.data;
          if(respData.isOk) {
            var ret = respData.data;
            if(Array.isArray(ret)) ret = ret[0];

            $scope.wordBuilt = ret;
            $scope.$digest();
            notifier.notify(JSON.stringify(ret));
          }

        });

      notifier.notify('Request is sent!)');
    }

    function onBtnGetAWordClicked() {
      http.getUnBuiltWord()
      .then(function(resp) {
        var respData = resp.data;
        if(respData === undefined) {
          notifier.error('An unexpected error occurs. Sorry.');
          return;
        }

        if(!respData.isSuccess) {
          notifier.error('Failed. Please try again later!');
          return;
        }

        $scope.wordToBuild = respData.data;
        $scope.$digest();
        //logger.info('Done! ' + JSON.stringify(resp));
      });

      notifier.notify('Request is sent!)');
    }

    function onBtnSubmitClicked(text) {
      if(util.isNullOrEmpty(text)) {
        notifier.error('Text cannot be empty!');
        return;
      }

      var parts = text.split(';');
      for(var i = 0; i < parts.length; i++) {
        parts[i] = parts[i].trim();
        if(util.isNullOrEmpty(parts[i])) {
          parts.splice(i, 1);
          i--;
        }
      }

      if(parts.length === 0) {
        notifier.error('Please enter some words!');
        return;
      }

      http.buildWords(parts)
      .then(function(resp) {
        notifier.notify('Done! ' + JSON.stringify(resp));
      });

      notifier.notify('Request is sent!)');

    }

  }
})();