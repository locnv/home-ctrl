/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  const CtrlConst = require('../controller/ctrl.constants');
  const dsWord = require('../database/ds.word');
  const dsTopicWord = require('../database/ds.topic.word');

  const Method = CtrlConst.Method;
  const Actions = CtrlConst.Actions;

  function WordController() { }

  WordController.prototype.handle = async function (req, params, query) {

    let retObj = {};
    let method = req.method;

    if(method === Method.Get) {
      retObj = await handleGet.call(this, req, query);
    } else if(method === Method.Post) {
      retObj = await handlePost.call(this, req, params);
    }

    return Promise.resolve(retObj);
  };

  async function handleGet(req, query) {

    let retObj = {
      isSuccess: true,
      controller: 'word',
      method: 'handleGet',
    };

    //let body = req.body;
    //console.log(query);

    let action = parseInt(query.action);
    switch(action) {
      case Actions.GetWordsByCard:
        let cardId = query.card;
        let wordsByCard = await getWordsByCard(cardId);
        retObj.data = wordsByCard;
        break;

      case Actions.GetWordsByTopic:
        let topicId = query.topicId;
        let wordsByTopic = await getWordsByTopics(topicId);
        retObj.data = wordsByTopic;
        break;

      case Actions.GetWordById:
        let wordId = query.wordId;
        let wById = await getWordById(wordId);
        retObj.data = wById;
        break;

      case Actions.GetWordByName:
        let name = query.name;
        let w = await getWordByName(name);
        retObj.data = w;
        break;

      default:
        retObj.isSuccess = false;
        break;
    }

    return Promise.resolve(retObj);
  }

  async function handlePost(req, params) {

    let retObj = {
      isSuccess: false,
      controller: 'word',
      method: 'handlePost',
    };

    let body = req.body;
    let action = body.action;
    switch(action) {
      case Actions.AddWord:
        let word = getRequestWord(body.data);
        retObj = await addWord(word);
        retObj.isSuccess = true;
        break;
      case Actions.RemoveWord:
        break;
      case Actions.UpdateWord:
        let word1 = body.data;
        //console.log('Updating word -> ' + JSON.stringify(word1));
        retObj = await updateWord(word1);
        retObj.isSuccess = true;
        break;

      default:
        break;
    }

    return Promise.resolve(retObj);
  }

  async function getWordByName(name) {
    return await dsWord.find({ name: name });
  }

  async function getWordById(wordId) {
    return await dsWord.find({ _id: wordId });
  }

  async function getWordsByCard(cardId) {

    return await dsWord.findWordsByCard(cardId);
  }

  async function getWordsByTopics(topicId) {

    let topicWords = await dsTopicWord.findWordsByTopic(topicId);

    if(!Array.isArray(topicWords) || topicWords.length === 0) {
      return null;
    }

    let wordIds = [];
    topicWords.forEach(function(tw) {
      wordIds.push(tw.word);
    });

    let words = await dsWord.findByIds(wordIds);

    return words;
  }

  async function addWord(word) {
    return await dsWord.create(word);
  }

  async function updateWord(word) {
    return await dsWord.update(word);
  }

  function getRequestWord(body) {
    let word = {
      card: body.card,
      name: body.name,
      description: body.description,
      example: body.example,
    };

    return word;
  }

  module.exports = new WordController();

})();