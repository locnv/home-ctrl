/*jshint esversion: 6 */
/* global angular */
/* global _global */
(function() {
  'use strict';

  angular.module(_global.AppName)
  .factory('HttpComm', ServiceImpl);

  ServiceImpl.$inject = [ '$http', 'Util', 'LogService' ];

  function ServiceImpl( $http, util, logger ) {

    var Host = util.Remote.Host;

    var Api = {
      Card: '/cards',
      Word: '/words',
      WordBuilder: '/words_builder',

      ElecCtrl: '/elec_ctrl'
    };
    var Actions = {
      CreateCard: 1,
      UpdateCard: 2,
      RemoveCard: 3,

      // Topic -> going to replace for Card
      CreateTopic: 13,
      GetTopicByName: 14,
      GetTopicById: 21,
      GetAllTopics: 20,
      AddWordToTopic: 15,
      RemoveWordFromTopic: 16,
      GetWordsByTopic: 17,
      ExportTopic: 18,
      DeleteTopic: 19,
      DownloadTopic: 23,

      AddWord: 4,
      UpdateWord: 5,
      RemoveWord: 6,
      GetWordsByCard: 7,
      GetWordByName: 12,
      GetWordById: 22,

      BuildWords: 9,
      GetUnBuilt: 10,
      UpdateImage: 11,

      CmdSwitch: 8,
    };

    var RequestType = {
      Get: 'get',
      Post: 'post',
      Put: 'put',
      Delete: 'delete',
    };

    var Errors = {
      NoError: 0,
      ServerError: 1,
    };

    var mInitialized = false;

    var inst = {
      Errors: Errors,

      initialize: initialize,
      isInitialized: isInitialized,

      // Learn Vocabulary
      getAllCards: getAllCards,
      addNewCards: addNewCards,
      getWordsByCard: getWordsByCard,

      // Topic shall be used to replace card
      createTopic: createTopic,
      deleteTopic: deleteTopic,
      getTopicByName: getTopicByName,
      getTopicById: getTopicById,
      getAllTopics: getAllTopics,
      addWordToTopic: addWordToTopic,
      getWordsByTopic: getWordsByTopic,
      removeWordFromTopic: removeWordFromTopic,
      exportTopic: exportTopic,
      getDownloadTopic: getDownloadTopic,

      getAllWords: getAllWords,
      getWordByName: getWordByName,
      getWordById: getWordById,
      addNewWord: addNewWord,
      updateWord: updateWord,
      buildWords: buildWords,
      getUnBuiltWord: getUnBuiltWord,
      updateImage: updateImage,

      // Home Elec Control
      sendSwitchCommand: sendSwitchCommand,
      scheduleSwitch: scheduleSwitch,

      sendRequest: sendRequest,
    };

    return inst;

    /**
     * Initialization
     *
     * @return {Promise}
     */
    function initialize() {
      var promise = new Promise(function(resolve, reject) {
        internal_initialize(resolve, reject);
      });

      function internal_initialize(_resolve, _reject) {
        if(mInitialized) {
          setTimeout(_resolve, 1);
          return;
        }

        mInitialized = true;
        setTimeout(_resolve, 1);
      }

      return promise;
    }

    function isInitialized() {
      return mInitialized;
    }


    // Home Elec Control
    function sendSwitchCommand(target, switchId, command) {
      logger.debug('[http] > sendSwitchCommand: switch ' + switchId + ' > ' + command);
      var params = {
        data: {
          target: target,
          switchId: switchId,
          command: command
        },
        Action: Actions.CmdSwitch
      };

      return sendRequest(RequestType.Post, Host, Api.ElecCtrl, params);
    }

    // Not done yet!
    function scheduleSwitch(target, switchId, command, delay) {
      logger.debug('[http] > scheduleSwitch: switch ' + switchId + ' > ' + command + '>' + delay);
      var params = {
        data: {
          target: target,
          switchId: switchId,
          command: 'schedule',
          subCommand: command,
          delay: delay
        },
        Action: Actions.CmdSwitch
      };

      return sendRequest(RequestType.Post, Host, Api.ElecCtrl, params);
    }

    // Learn Voca
    function getAllCards() {
      return sendRequest(RequestType.Get, Host, Api.Card);
    }

    function addNewCards(name, description) {
      var params = {
        data: {
          name: name,
          description: description,
        },
        action: Actions.CreateCard,
      };

      return sendRequest(RequestType.Post, Host, Api.Card, params);
    }

    function getTopicByName(topicName) {

      var reqParamsObj = {
        params: {
          topicName: topicName,
          action: Actions.GetTopicByName,
        }
      };

      var promise = new Promise(function(resolve) {
        sendRequest(RequestType.Get, Host, Api.Card, reqParamsObj)
        .then(function(resp) {
          resolve(resp.data);
        });
      });

      return promise;

    }

    function getTopicById(topicId) {

      var reqParamsObj = {
        params: {
          topicId: topicId,
          action: Actions.GetTopicById,
        }
      };

      var promise = new Promise(function(resolve) {
        sendRequest(RequestType.Get, Host, Api.Card, reqParamsObj)
          .then(function(resp) {
            resolve(resp.data);
          });
      });

      return promise;

    }

    function getAllTopics() {

      var reqParamsObj = {
        params: { action: Actions.GetAllTopics }
      };

      var promise = new Promise(function(resolve) {
        sendRequest(RequestType.Get, Host, Api.Card, reqParamsObj)
          .then(function(resp) {
            resolve(resp.data);
          });
      });

      return promise;

    }

    /**
     *
     * @param topicName
     * @param description
     * @param baseWords
     * @returns {Promise}
     */
    function createTopic(topicName, description, baseWords) {
      var params = {
        data: {
          name: topicName,
          description: description,
          baseWords: baseWords
        },
        action: Actions.CreateTopic,
      };

      return sendRequest(RequestType.Post, Host, Api.Card, params);
    }

    /**
     * Delete a topic by id
     * @param topicId
     */
    function deleteTopic(topicId) {
      var params = {
        data: { topicId: topicId },
        action: Actions.DeleteTopic,
      };

      return sendRequest(RequestType.Post, Host, Api.Card, params);
    }

    function addWordToTopic(topicId, wordId) {
      var params = {
        data: {
          topicId: topicId,
          wordId: wordId
        },
        action: Actions.AddWordToTopic,
      };

      return sendRequest(RequestType.Post, Host, Api.Card, params);
    }

    function removeWordFromTopic(topicId, wordId) {
      var params = {
        data: {
          topicId: topicId,
          wordId: wordId
        },
        action: Actions.RemoveWordFromTopic,
      };

      return sendRequest(RequestType.Post, Host, Api.Card, params);
    }

    function exportTopic(topicId) {
      var params = {
        data: { topicId: topicId },
        action: Actions.ExportTopic,
      };

      return sendRequest(RequestType.Post, Host, Api.Card, params);
    }

    function getDownloadTopic(fileName) {

      // Make the POST request
      /*window.fetch('/cards', request)
      .then(res => {
        var text = res.text();
        logger.info('res.text -> ' + text);
        return text;
      })
      .then(content => {
        //var uriContent = "data:application/octet-stream," + encodeURIComponent(content);
        //var newWindow = window.open(uriContent, 'topic-xxx.csv');
        logger.info('content');
        logger.info(content);
      });*/

      var reqParamsObj = {
        params: {
          data: { fileName: fileName },
          action: Actions.DownloadTopic,
        }
      };

      /*return */
      sendRequest(RequestType.Get, Host, Api.Card, reqParamsObj)
      .then(res => {
        logger.info('res -> ' + res);
        return res;
      })
      .then(content => {
        logger.info('content');
        logger.info(content.data);
        //var uriContent = "data:application/octet-stream," + encodeURIComponent(content);
        var uriContent = "data:application/octet-stream," + content.data;
        var newWindow = window.open(uriContent, 'topic-xxx.csv');

      });
    }

    function getWordsByCard(cardId) {
      var reqParamsObj = {
        params: {
          card: cardId,
          action: Actions.GetWordsByCard,
        }
      };

      var promise = new Promise(function(resolve) {
        sendRequest(RequestType.Get, Host, Api.Word, reqParamsObj)
        .then(function(resp) {
          resolve(resp.data);
        });
      });

      return promise;

    }

    function getWordsByTopic(topicId) {

      var reqParamsObj = {
        params: {
          topicId: topicId,
          action: Actions.GetWordsByTopic,
        }
      };

      var promise = new Promise(function(resolve) {
        sendRequest(RequestType.Get, Host, Api.Word, reqParamsObj)
          .then(function(resp) {
            resolve(resp.data);
          });
      });

      return promise;

    }

    function getAllWords() {
      return sendRequest(RequestType.Get, Host, Api.Word);
    }

    function getWordByName(name) {

      var reqParamsObj = {
        params: {
          action: Actions.GetWordByName,
          name: name
        }
      };

      return sendRequest(RequestType.Get, Host, Api.Word, reqParamsObj);
    }

    function getWordById(wordId) {

      var reqParamsObj = {
        params: {
          action: Actions.GetWordById,
          wordId: wordId
        }
      };

      return sendRequest(RequestType.Get, Host, Api.Word, reqParamsObj);
    }

    function addNewWord(cardId, word, explain, example) {
      var params = {
        data: {
          card: cardId,
          name: word,
          description: explain,
          example: example,
        },
        action: Actions.AddWord,
      };

      return sendRequest(RequestType.Post, Host, Api.Word, params);
    }

    function updateWord(word) {
      var params = {
        data: word,
        action: Actions.UpdateWord,
      };

      return sendRequest(RequestType.Post, Host, Api.Word, params);
    }

    /**
     * Get a random word not yet built
     */
    function getUnBuiltWord() {

      var reqParamsObj = { params: { action: Actions.GetUnBuilt } };

      return sendRequest(RequestType.Get, Host, Api.WordBuilder, reqParamsObj);
    }

    function updateImage(imageInfo) {
      var params = {
        data: imageInfo,
        action: Actions.UpdateImage,
      };

      return sendRequest(RequestType.Post, Host, Api.WordBuilder, params);

    }

    /**
     *
     * @param words -> text array
     */
    function buildWords(words) {
      var params = {
        data: { words: words },
        action: Actions.BuildWords,
      };

      return sendRequest(RequestType.Post, Host, Api.WordBuilder, params);
    }

    /**
     *
     * @param reqType
     * @param host
     * @param api
     * @return {Promise}
     */
    function sendRequest(reqType, host, api, param) {
      let Fn = $http.get;

      switch (reqType) {
        case RequestType.Get:
          break;

        case RequestType.Post:
          Fn = $http.post;
          break;

        case RequestType.Put:
          Fn = $http.put;
          break;

        case RequestType.Delete:
          Fn = $http.delete;
          break;

        default:
          break;
      }

      var promise = new Promise(function(resolve, reject) {
        var url = host + api;
        logger.debug('url > ' + url);

        var args = [url];
        if(param) {
          args.push(param);
        }

        Fn.apply($http, args)
        .then(function(resp) {
          resolve(resp);
        })
        .catch(handleError.bind(null, reject));
      });

      return promise;
    }

    function handleError(next, err) {
      logger.error(err);

      if(next) {
        next.call(err);
      }
    }

  }
})();
