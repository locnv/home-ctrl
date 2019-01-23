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

      ElecCtrl: '/elec_ctrl'
    };
    var Actions = {
      CreateCard: 1,
      UpdateCard: 2,
      RemoveCard: 3,

      AddWord: 4,
      UpdateWord: 5,
      RemoveWord: 6,
      GetWordsByCard: 7,

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
      getAllWords: getAllWords,
      addNewWord: addNewWord,

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

    function getAllWords() {
      return sendRequest(RequestType.Get, Host, Api.Word);
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
