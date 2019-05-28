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
  .controller(_global.Controllers.TopicBuilder, ControlerImpl);

  ControlerImpl.$inject = ['$scope', '$controller', 'DIC', 'AppCsf'];

  function ControlerImpl($scope, $controller, dic, AppCsf) {
    var mConst = AppCsf.appConst;
    var log = AppCsf.logger;
    var util = AppCsf.util;
    var i18n = AppCsf.i18n;
    var notifier = AppCsf.notifier;
    var http = AppCsf.http;
    var CtrlName = _global.Controllers.TopicBuilder;

    /* Scope variables */
    $scope.CtrlName = CtrlName;
    $scope.PageTitle = 'Topic Builder';

    // Working topic
    $scope.topic = {};
    $scope.wordsByTopic = [];

    $scope.onEntering = onEntering;
    $scope.onLeaving = onLeaving;
    $scope.onResume = onResume;
    $scope.onLanguageChanged = onLanguageChanged;

    $scope.getTopicByName = getTopicByName;
    $scope.createTopic = createTopic;
    $scope.deleteTopicByName = deleteTopicByName;
    $scope.getWordByName = getWordByName;
    $scope.onBtnGetWordsByTopicClicked = onBtnGetWordsByTopicClicked;
    $scope.onBtnAddWordToTopicClicked = addWordToTopic;
    $scope.onBtnRemoveWordFromTopicClicked = removeWordFromTopic;

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

    function onResume() { }

    /**
     * Page initialization
     */
    function initialize() {
      log.info('topic-builder -> initialized!');
    }

    function onLanguageChanged() { }

    function getTopicByName(topicName) {
      log.info('[topic-builder][get-topic-by-name] -> ' + topicName);
      http.getTopicByName(topicName)
      .then(function(respData) {
        if(!respData.isSuccess) {
          notifier.error('Failed to get topic by name.');
          return;
        }

        $scope.topic = angular.copy(respData.data);
        $scope.$digest();
        if(!respData.data) {
          notifier.error('Topic not found!');
        }
      });
    }

    function createTopic(name, description) {

      log.info('[topic-builder][delete-topic-by-name] -> ' + name + '; Desc -> ' + description);

      http.createTopic(name, description)
      .then(function(resp) {
        log.info(resp);
      });
    }

    function deleteTopicByName(topicName) {
      log.info('[topic-builder][delete-topic-by-name] -> ' + topicName);
      http.deleteTopicByName(topicName)
      .then(function(resp) {
        log.info(resp);
      });
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

          let respData = resp.data;
          let word = respData.data;
          if(Array.isArray(word)) word = word[0];

          if(word) {
            $scope.searchWord = angular.copy(word);
            $scope.$digest();
          } else {
            notifier.error('Word not found!');
          }

        });
    }

    function onBtnGetWordsByTopicClicked() {
      if(!$scope.topic) {
        notifier.error('Please select a topic.');
        return;
      }

      var topicId = $scope.topic._id;

      log.info('[topic-builder][get-words] -> topic = ' + topicId);

      http.getWordsByTopic(topicId)
        .then(function(resp) {
          if(!resp || !resp.data) {
            notifier.error('An error occurred!');
            return;
          }

          var words = resp.data;
          $scope.wordsByTopic = angular.copy(words);
          $scope.$digest();
          notifier.notify('Get words by topic returned');
        });

      notifier.notify('Request is sent!');
    }

    function addWordToTopic() {

      if(!$scope.topic || !$scope.searchWord) {
        notifier.error('Please select a topic and a word.');
        return;
      }

      var topicId = $scope.topic._id;
      var wordId = $scope.searchWord._id;

      log.info('[topic-builder][add-word] -> word = ' + wordId +'; topic = ' + topicId);
      http.addWordToTopic(topicId, wordId)
      .then(function(resp) {
        if(!resp || !resp.data || !resp.data.isSuccess) {
          notifier.error('An error occurred!');
          return;
        }

        //var respData = resp.data;
        notifier.notify('Added word into topic.');
      });

      notifier.notify('Request is sent!');
    }

    function removeWordFromTopic() {

      if(!$scope.topic || !$scope.searchWord) {
        notifier.error('Please select a topic and a word.');
        return;
      }

      var topicId = $scope.topic._id;
      var wordId = $scope.searchWord._id;

      log.info('[topic-builder][remove-word] -> word = ' + wordId +'; topic = ' + topicId);
      http.removeWordFromTopic(topicId, wordId)
      .then(function(resp) {
        if(!resp || !resp.data) {
          notifier.error('An error occurred!');
          return;
        }

        var respData = resp.data;
        if(!respData.isSuccess) {
          notifier.error('An error occurred *!');
          return;
        }

        notifier.notify('Removed word from topic.');
      });

      notifier.notify('Request is sent!');
    }

  }
})();
