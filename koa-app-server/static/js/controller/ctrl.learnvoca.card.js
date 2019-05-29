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

  ControlerImpl.$inject = ['$scope', '$controller', 'AppCsf'];

  function ControlerImpl($scope, $controller, AppCsf) {
    var mConst = AppCsf.appConst;
    var log = AppCsf.logger;
    var util = AppCsf.util;
    var fileStorage = AppCsf.fileStorage;
    var i18n = AppCsf.i18n;
    var notifier = AppCsf.notifier;
    var http = AppCsf.http;
    var CtrlName = _global.Controllers.Card;

    /* Scope variables */
    $scope.CtrlName = CtrlName;
    $scope.PageTitle = 'Topic';
    $scope.topic = {};
    $scope.allWords = [];

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
      var topicId = $scope.getUrlParam('topicId');
      http.getTopicById(topicId)
        .then(function(respData) {
          if(!respData.isSuccess) {
            notifier.error('Failed to get topic by id.');
            return;
          }

          $scope.topic = angular.copy(respData.data);
          loadTopicWords();
          $scope.$digest();
          if(!respData.data) {
            notifier.error('Topic not found!');
          }
        });
    }

    function loadTopicWords() {
      if(!$scope.topic) {
        log.error('Topic not found!');
        return;
      }

      var topicId = $scope.topic._id;

      loadWordsForTopic(topicId);
    }

    function loadWordsForTopic(topicId) {
      log.info('[topic][get-words] -> topic = ' + topicId);

      http.getWordsByTopic(topicId)
        .then(function(resp) {
          if(!resp || !resp.data) {
            notifier.error('An error occurred!');
            return;
          }

          var words = resp.data;
          $scope.allWords = angular.copy(words);
          $scope.$digest();
        });
    }

    function onLanguageChanged() {
      //btnFooterLeft.caption = getBtnStartStopText();
      //btnFooterRight.caption = i18n.translate('static.FILTER');
    }

  }
})();