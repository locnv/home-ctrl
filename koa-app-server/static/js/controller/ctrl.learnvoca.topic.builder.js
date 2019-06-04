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
    $scope.searchWordByName = searchWordByName;
    $scope.onBtnGetWordsByTopicClicked = onBtnGetWordsByTopicClicked;
    $scope.onBtnAddWordToTopicClicked = addWordToTopic;
    $scope.onBtnWordClicked = onBtnWordClicked;
    $scope.onBtnBuildWordClicked = onBtnBuildWordClicked;
    $scope.onBtnRemoveWordFromTopicClicked = removeWordFromTopic;
    $scope.onBtnExportTopicClicked = onBtnExportTopicClicked;
    $scope.onBtnNewTopicClicked = onBtnNewTopicClicked;
    $scope.onBtnDeleteTopicClicked = onBtnDeleteTopicClicked;
    $scope.onTopicSelectionChanged = onTopicSelectionChanged;
    $scope.onBtnDownloadClicked = onBtnDownloadClicked;
    $scope.onBtnCreateTopicFromTextClicked = onBtnCreateTopicFromTextClicked;

    $scope.smartTopicCtx = {
      baseWords: [],
      selectedWords: [],
      onWordChange: function(w) {
        var baseList = w.selected ? this.baseWords : this.selectedWords;
        var targetList = w.selected ? this.selectedWords : this.baseWords;

        var idx = baseList.indexOf(w);
        if(idx !== -1) {
          baseList.splice(idx, 1);
          targetList.push(w);
        }
      },
      onBtnMakeTopicClick: function(topicName) {
        if(!topicName || topicName.length === 0) {
          notifier.error('Topic name cannot be empty!');
          return;
        }

        if(this.selectedWords.length === 0) {
          notifier.error('Please select at least one word to make a topic.');
          return;
        }

        var words = [];
        this.selectedWords.forEach(function(w) {
          words.push(w.name);
        });
        createTopic(topicName, '', words);
        //log.info(topicName);
        //log.info(this.selectedWords);
      }
    };
    $scope.txtAreaInput = 'Over the next few weeks, as I travelled the length and breadth of the country, wherever I went I found locals who knew the poem well and were happy to educate me about its significance: the peasant women with their income-generation project out in the jungle, the rice farmer in his paddy field, the government officials up in Hanoi. And there in Hanoi I picked up a bilingual copy of Kieu for myself, and began to decipher it, line by line. I was delighted with the text’s freshness and its modernity, with how its sense of fun leavened the telling of its tragedy. And it struck me that foreign powers might have thought twice before invading a country whose population is fortified by this story, whose message is that you must keep going, no matter what life throws at you. Stay true to yourself and you will come through the worst torments. And those cruel ones who consider themselves powerful will wither and fade, like the best and the rest of us.';

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

    function onBtnDeleteTopicClicked() {
      if(!$scope.selectedTopic.name) {
        notifier.error('Please select a topic.');
        return;
      }

      notifier.notify('To be implemented: Deleting topic -> ' + $scope.selectedTopic.name);
      var topicId = $scope.selectedTopic._id;
      http.deleteTopic(topicId)
      .then(function(resp) {
        if(!resp || !resp.data) {
          notifier.error('An unexpected error occurs while deleting topic.');
          return;
        }

        var respData = resp.data;
        if(respData.isSuccess) {
          notifier.notify('Deleted topic ' + $scope.selectedTopic.name);
        } else {
          notifier.error('An error occurs while deleting topic.');
        }
      })
    }

    function createTopic(name, description, baseWords) {

      log.info(
        '[topic-builder][delete-topic-by-name] -> '
        + name + '; Desc -> ' + description + '; baseWords -> ' + JSON.stringify(baseWords));

      http.createTopic(name, description, baseWords || [])
      .then(function(resp) {
        if(!resp || !resp.data) {
          notifier.error('Failed to create topic!');
          return;
        }

        let respData = resp.data;
        log.info(respData);
        if(!respData.isSuccess) {
          if(respData.message) {
            notifier.error(respData.message);
          } else {
            notifier.error('An error occurs while creating topic.');
          }

          return;
        }

        notifier.notify('Created new topic.');

      });
    }

    function deleteTopicByName(topicName) {
      log.info('[topic-builder][delete-topic-by-name] -> ' + topicName);
      http.deleteTopicByName(topicName)
      .then(function(resp) {
        log.info(resp);
      });
    }

    function searchWordByName(name) {
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
          let words = respData.data;
          if(!words) {
            notifier.error('Word not found!');
            return;
          }

          if(!Array.isArray(words)) words = words[words];
            $scope.searchWords = angular.copy(words);
            $scope.$digest();
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

    function onBtnBuildWordClicked(word) {
      var parts = [ word.name ];
      http.buildWords(parts)
        .then(function(resp) {
          var respData = resp.data;
          if(respData.isOk) {
            var ret = respData.data;
            if(Array.isArray(ret)) ret = ret[0];

            notifier.notify(JSON.stringify(ret));
          }

        });

      notifier.notify('Request is sent!)');
    }

    function onBtnWordClicked(word) {
      log.info(word);
    }

    function addWordToTopic(word) {

      if(!$scope.selectedTopic._id || !word) {
        notifier.error('Please select a topic.');
        return;
      }

      var topicId = $scope.selectedTopic._id;
      var wordId = word._id;

      log.info('[topic-builder][add-word] -> word = ' + wordId +'; topic = ' + topicId);
      http.addWordToTopic(topicId, wordId)
      .then(function(resp) {
        if(!resp || !resp.data || !resp.data.isSuccess) {
          notifier.error('An error occurred!');
          return;
        }

        //var respData = resp.data;
        var w = angular.copy(word);
        $scope.wordsByTopic.push(w);
        $scope.$digest();
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

        log.info(resp.data);

        if(!resp || !resp.data) {
          notifier.error('An error occurred!');
          return;
        }

        var respData = resp.data;
        if(!respData.isSuccess) {
          notifier.error('An error occurred *!');
          return;
        }

        $scope.exportedFileName = respData.data.fileName;
        $scope.$digest();

        notifier.notify('Exported ... going to download!');

      });
    }

    function onTopicSelectionChanged() {
      let topicId = $scope.selectedTopic._id;
      if(!topicId) return;

      loadWordsForTopic(topicId);

    }

    function onBtnDownloadClicked(fileName) {
      log.info('Going to download file -> ' + fileName);

      http.getDownloadTopic(fileName)
        .then(function(resp) {
          if(!resp || !resp.data) {
            notifier.error('An error occurred!');
            return;
          }

          notifier.notify('Download responded!');
        });
    }

    function onBtnCreateTopicFromTextClicked(text) {
      if(!text || text.length === 0) {
        notifier.error('Text is empty!');
        return;
      }

      var desired = text.replace(/[^\w\s]/gi, '');
      var words = desired.split(' ');
      var baseWords = [];
      var i, j;
      for(i = 0; i < words.length; i++) {
        var w = words[i].toLowerCase();
        if(baseWords.indexOf(w) === -1) {
          baseWords.push(w);
        }
      }

      baseWords.forEach(function(word) {
        $scope.smartTopicCtx.baseWords.push({
          name: word,
          selected: false,
          description: ''
        });
      });

      log.info('Going to build topic from text -> ');
      log.info($scope.baseWords);
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
