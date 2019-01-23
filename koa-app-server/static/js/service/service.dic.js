/*jshint esversion: 6 */
/* global angular */
/* global _global */
(function() {
  'use strict';

  angular.module(_global.AppName)
    .factory('DIC', ServiceImpl);

  ServiceImpl.$inject = [ 'FileStorage', 'LogService', 'HttpComm' ];

  function ServiceImpl( fileStorage, logger, http ) {

    var CardFileNamePrefix = 'learnvoca-card-';
    var CardFileExt = '.json';

    var mInitialized = false;
    var Cards = [];

    var Error = {
      Ok: 0,
      CardExist: 1,
      CardNotExist: 2,
    };

    var inst = {
      Constants: {
        ErrorCode: Error,
      },
      initialize: initialize,
      isInitialized: isInitialized,
      getAllCards: getAllCards,
      getCardById: getCardById,
      getCardByName: getCardByName,
      getWord: getWord,
      getWords: getWords,

      createCard: createCard,
      addWord: addWord,
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

      function internal_initialize(_resolve) {
        if(mInitialized) {
          setTimeout(_resolve, 1);
          return;
        }

        http.getAllCards()
        .then(function(resp) {
          if(resp.data.isSuccess) {
            Cards = resp.data.cards;
          }

          _resolve();
        });

        /*fileStorage.getAllFiles()
        .then(function(appFiles) {
          var cardFiles = appFiles.filter(function(file) {
            if(!file || file.isDirectory) {
              return false;
            }
            var fileName = file.name;
            return fileName.startsWith(CardFileNamePrefix) && fileName.endsWith(CardFileExt);
          });

          if(cardFiles && cardFiles.length > 0) {
            loadDb(cardFiles)
            .then(function(cards) {
              logger.info('[dic] > loaded all cards > ' +JSON.stringify(cards));
              if(Array.isArray(cards) && cards.length > 0) {
                Cards = cards;
              }

              mInitialized = true;
              _resolve();
            });
          }
        }).catch(_resolve);
        */
      }

      return promise;
    }

    function loadDb(fileEntries) {
      var cards = [];
      var promise = new Promise(function(resolve, reject) {
        internal_loadCard(fileEntries, 0, cards, resolve.bind(null, cards));
      });

      return promise;
    }

    function internal_loadCard(fileEntries, idx, out, fCallback) {
      if(idx >= fileEntries.length) {
        return fCallback.call(null, out);
      }

      var fileName = fileEntries[idx].name;
      logger.info('[dic] > loading > ' + fileName);
      idx++;

      fileStorage.readFromFile(fileName)
      .then(function(cardObj) {
        out.push(cardObj);
        setTimeout(internal_loadCard.bind(null, fileEntries, idx, out, fCallback), 1);
      })
      .catch(function(err) {
        logger.warn('[dic] > fail to load a card > ' + fileName);
        setTimeout(internal_loadCard.bind(null, fileEntries, idx, out, fCallback), 1);
      });
    }

    function isInitialized() {
      return mInitialized;
    }

    function getAllCards() {
      return Cards.map(function(entry) {
        return {
          id: entry._id,
          name: entry.name,
        };
      });
    }

    function getCardById(cardId) {
      var card = null;
      for(var i = 0; i < Cards.length; i++) {
        if(Cards[i]._id === cardId) {
          card = Cards[i];
          break;
        }
      }

      //if(card && !card.words) {
      //  card.words = new Array(0);
      //}

      if(card && !card.id && card._id) {
        card.id = card._id;
      }

      return card;
    }

    function getCardByName(cardName) {
      var card = null;
      for(var i = 0; i < Cards.length; i++) {
        if(Cards[i].name === cardName) {
          card = Cards[i];
          break;
        }
      }

      return card;
    }

    function getWord(cardId, name) {

      var card = getCardById(cardId);
      if(!card) {
        return null;
      }

      var words = card.words;
      var word = null;

      for(var i = 0; i < words.length; i++) {
        if(words[i].name === name) {
          word = words[i];
          break;
        }
      }

      return word;
    }

    function getWords(cardId) {
      var card = getCardById(cardId);
      if(!card) {
        return Promise.resolve(null);
      }

      var words = card.words;
      if(words !== undefined && words !== null) {
        return Promise.resolve(words);
      }

      var promise = new Promise(function(resolve) {
        http.getWordsByCard(cardId)
        .then(function(words) {
          card.words = words;
          resolve(words);
        });
      });

      return promise;
    }

    function createCard(name) {
      var exist = getCardByName(name);
      if(exist !== null) {
        return {
          error: Error.CardExist,
        };
      }

      var card = {
        id: getNewCardId(),
        name: name,
        description: '',
        words: [],
      };

      Cards.push(card);
      setTimeout(saveCard.bind(null, card), 1);

      return {
        error: Error.Ok,
      };
    }

    function saveCard(card) {
      var fileName = CardFileNamePrefix + card.id + CardFileExt;
      fileStorage.writeToFile(fileName, card);
    }

    function getNewCardId() {
      return "" +(new Date().getTime());
    }

    function addWord(cardId, word) {
      var card = getCardById(cardId);
      if(!card) {
        return {
          error: Error.CardNotExist,
        };
      }

      var w = {
        word: name,
        description: word.description || '',
        example: word.example || '',
      };

      if(!card.words || !Array.isArray(card.words)) {
        card.words = new Array(0);
      }

      card.words.push(word);
      saveCard(card);

      return {
        error: Error.Ok,
      };
    }

  }
})();