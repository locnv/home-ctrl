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
    $scope.selectedTopic = {};
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
    $scope.onBtnExportTopicClicked = onBtnExportTopicClicked;
    $scope.onBtnNewTopicClicked = onBtnNewTopicClicked;
    $scope.onTopicSelectionChanged = onTopicSelectionChanged;

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

      http.getAllTopics()
      .then(function(resp) {
        if(!resp || !resp.data) return;

        var respData = resp.data;
        if(Array.isArray(respData) && respData.length > 0) {
          $scope.allTopics = angular.copy(respData);
          $scope.$digest();
        }

        //log.info(respData);
      });
    }

    function onLanguageChanged() { }

    /**
     * Remove word from the current wordByTopic (locally)
     * @param word
     */
    function removeWordInCurrentList(word) {
      let idx = $scope.wordsByTopic.indexOf(word);
      if(idx !== -1) {
        $scope.wordsByTopic.splice(idx, 1);
      }
    }

    function getTopicByName(topicName) {
      log.info('[topic-builder][get-topic-by-name] -> ' + topicName);
      http.getTopicByName(topicName)
      .then(function(respData) {
        if(!respData.isSuccess) {
          notifier.error('Failed to get topic by name.');
          return;
        }

        $scope.selectedTopic = angular.copy(respData.data);
        $scope.$digest();
        if(!respData.data) {
          notifier.error('Topic not found!');
        }
      });
    }

    function onBtnNewTopicClicked() {
      var topicName = prompt('Enter topic name:');
      log.info('Going to create -> ' + topicName);
      if(topicName === undefined || topicName.length === 0) {
        return;
      }

      createTopic(topicName, '');
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
      if(!$scope.selectedTopic) {
        notifier.error('Please select a topic.');
        return;
      }

      var topicId = $scope.selectedTopic._id;

      loadWordsForTopic(topicId);
    }

    function addWordToTopic() {

      if(!$scope.selectedTopic || !$scope.searchWord) {
        notifier.error('Please select a topic and a word.');
        return;
      }

      var topicId = $scope.selectedTopic._id;
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
    }

    function removeWordFromTopic(word) {

      if(!$scope.selectedTopic || !word) {
        notifier.error('Please select a topic and a word.');
        return;
      }

      var topicId = $scope.selectedTopic._id;
      var wordId = word._id;

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

        removeWordInCurrentList(word);
        $scope.$digest();

        notifier.notify('Removed word from topic.');
      });
    }

    function onBtnExportTopicClicked() {
      if(!$scope.selectedTopic) {
        notifier.error('Please select a topic to export.');
        return;
      }

      var topicId = $scope.selectedTopic._id;

      log.info('[topic-builder][exporting] -> topic = ' + topicId);
      http.exportTopic(topicId)
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

        notifier.notify('Exported ... going to download!');

      });
    }

    function onTopicSelectionChanged() {
      let topicId = $scope.selectedTopic._id;
      if(!topicId) return;

      loadWordsForTopic(topicId);

    }

    function loadWordsForTopic(topicId) {
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
    }

  }
})();
