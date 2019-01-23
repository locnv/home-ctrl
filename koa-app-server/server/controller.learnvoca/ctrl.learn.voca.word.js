/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  const CtrlConst = require('../controller/ctrl.constants');
  const dsWord = require('../database/ds.word');

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

    let body = req.body;

    console.log(query);

    let action = parseInt(query.action);
    let Fn = null;
    switch(action) {
      case Actions.GetWordsByCard:
        Fn = getWordsByCard;
        break;

      default:
        break;
    }

    if(typeof Fn === 'function') {
      let cardId = query.card;
      retObj = await Fn.call(this, cardId);
    }

    return Promise.resolve(retObj);
  }

  async function handlePost(req, params) {

    let retObj = {
      isSuccess: true,
      controller: 'word',
      method: 'handlePost',
    };

    let body = req.body;
    let action = body.action;
    let Fn = null;
    switch(action) {
      case Actions.AddWord:
        Fn = addWord;
        break;
      case Actions.RemoveWord:
      case Actions.UpdateWord:
        break;

      default:
        break;
    }

    if(typeof Fn === 'function') {
      let word = getRequestWord(body.data);
      retObj = await Fn.call(this, word);
    } else {
      console.error('Invalid Action!');
    }

    return Promise.resolve(retObj);
  }

  async function getWordsByCard(cardId) {

    console.log('find words > cardId > ' + cardId);
    return await dsWord.findWordsByCard(cardId);
  }

  async function addWord(word) {
    return await dsWord.create(word);
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