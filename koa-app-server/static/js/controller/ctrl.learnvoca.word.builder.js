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

    // Manual builder
    $scope.mWord = {
      name: '',
      type: '',
      pronunciation: '',
      descriptions: [''],
      examples: [''],
      //https://images.unsplash.com/photo-1516632664305-eda5d6a5bb99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3159&q=80
      imageUrl: ''
    };

    $scope.onEntering = onEntering;
    $scope.onLeaving = onLeaving;
    $scope.onResume = onResume;
    $scope.onLanguageChanged = onLanguageChanged;

    $scope.onBtnSubmitClicked = onBtnSubmitClicked;
    $scope.onBtnGetAWordClicked = onBtnGetAWordClicked;
    $scope.getWordByName = getWordByName;
    $scope.onBtnBuildWordClicked = onBtnBuildWordClicked;
    $scope.onBtnUpdateImageClicked = onBtnUpdateImageClicked;
    $scope.onTxtLinkLostFocus = onTxtLinkLostFocus;

    // Manual
    $scope.onBtnAddDef = onBtnAddDef;
    $scope.onBtnAddExample = onBtnAddExample;
    $scope.onBtnManualUpdateClicked = onBtnManualUpdateClicked;

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

    function onLanguageChanged() { }

    function onBtnAddDef() {
      $scope.mWord.descriptions.push('');
    }

    function onBtnAddExample() {
      $scope.mWord.examples.push('');
    }

    function onBtnManualUpdateClicked() {
      let hasModify = !angular.equals($scope.wordToBuild, $scope.mWord);
      if(!hasModify) {
        notifier.error('No changes!');
        return;
      }

      http.updateWord($scope.mWord)
      .then(function(resp) {
        notifier.notify(JSON.stringify(resp));
      });

      notifier.notify('Request is sent!');
    }

    //https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
    function onTxtLinkLostFocus(txtLink) {
      $scope._txtLink = txtLink;
    }

    function onBtnUpdateImageClicked(wordId, link, imgSource, author) {
      if(link === null || link === undefined) {
        notifier.error('Image url cannot be empty!');
        return;
      }

      var imgInfo = {
        wordId: wordId,
        imgUrl: link,
        source: imgSource,
        author: author
      };

      http.updateImage(imgInfo)
      .then(function(resp) {
        notifier.notify(JSON.stringify(resp));
      });

      log.info('Going to update image -> ' + wordId + ' -> ' + link);
      notifier.notify('Sent update image request!)');
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

    function getWordByName(name) {
      if(!name || name.length === 0) {
        notifier.error('Text is empty!');
        return;
      }

      http.getWordByName(name)
      .then(function(resp) {
        if(!resp || !resp.data) {
          notifier.error('Failed to get word!');
          return;
        }

        let word = resp.data;
        if(Array.isArray(word)) word = word[0];

        if(word) {
          $scope.mWord = angular.copy(word);
          $scope.$digest();
        } else {
          notifier.error('Word not found!');
        }

      });
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
        $scope.mWord = angular.copy(respData.data);
        //log.info(angular.equals($scope.wordToBuild, $scope.mWord));
        $scope.$digest();
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