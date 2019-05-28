/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  const CtrlConst = require('../controller/ctrl.constants');
  const dsWord = require('../database/ds.word');
  const wordBuilderService = require('../word-builder/service.word.builder');
  const logger = require('../util/logger');

  const Method = CtrlConst.Method;
  const Actions = CtrlConst.Actions;

  function WordBuilderController() { }

  WordBuilderController.prototype.handle = async function (req, params, query) {

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
      isSuccess: false,
      controller: 'word.builder',
      method: 'handleGet',
    };

    //console.log(query);
    let action = parseInt(query.action);

    switch(action) {
      case Actions.GetUnBuilt:
        let aWord = await getUnbuiltWord();

        retObj.isSuccess = true;
        retObj.data = aWord;

        break;

      default:
        break;
    }

    return Promise.resolve(retObj);

  }

  function getUnbuiltWord() {

    let promise = new Promise(async function(resolve, reject) {

      let nbWord = await dsWord.count();
      // Get random [0, nbWord]
      let idx = Math.floor(Math.random() * nbWord) /* + 0 */;
      let dbWord = await dsWord.getAt(idx);
      if(Array.isArray(dbWord)) dbWord = dbWord[0];

      let word = {};

      if(dbWord) {
        word._id = dbWord._id;
        word.name = dbWord.name;
        word.descriptions = dbWord.descriptions;
        word.examples = dbWord.examples;
        word.type = dbWord.type;
        word.pronunciation = dbWord.pronunciation;
        word.imageUrl = dbWord.imageUrl;
      }

      logger.info(`Get un-built word -> idx / nbWord = (${idx} / ${nbWord}) -> ${JSON.stringify(word)}`);

      resolve(word);
    });

    return promise;


  }

  function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    let copy = obj.constructor();
    for (let attr in obj) {
      logger.info('copying -> ' + attr + ' -> obj -> ' +JSON.stringify(copy));
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  }


  async function handlePost(req, params) {

    let retObj = {
      isSuccess: true,
      controller: 'word.builder',
      method: 'handlePost',
    };

    let reqBody = req.body;
    let action = reqBody.action;

    switch(action) {

      case Actions.UpdateImage:
        let reqData = reqBody.data;
        await updateImage(reqData);
        break;

      case Actions.BuildWords:

        let words = reqBody.data.words;
        if(!Array.isArray(words)) {
          retObj.isSuccess = false;
          logger.error('Request body must be array of words. Found: ' +JSON.stringify(words));
          break;
        }

        retObj = await buildWords(words);
        break;

      default:
        break;
    }

    return Promise.resolve(retObj);
  }

  async function updateImage(imageInfo) {
    logger.info(`Update image -> ${JSON.stringify(imageInfo)}`);

    if(!imageInfo.wordId || !imageInfo.imgUrl) {
      logger.error('[word-builder] -> update image. wordId and imgUrl are required!');
      return false;
    }

    try {
      let word = await dsWord.findOne({ _id: imageInfo.wordId });
      if(word === null) {
        logger.warn(`[word-builder] -> update image on non-exist word ${imageInfo.wordId}. Stop!`);
        return false;
      }

      word.imageUrl = imageInfo.imgUrl;
      word.imageSource = imageInfo.source || '';
      word.imageAuthor = imageInfo.author || '';

      await dsWord.update(word);
    } catch (e) {
      logger.error(`word-builder -> failed to update image.`, e);
      return false;
    }

    return true;

  }

  async function getWordsByCard(cardId) {

    console.log('find words > cardId > ' + cardId);
    return await dsWord.findWordsByCard(cardId);
  }

  async function addWord(word) {
    return await dsWord.create(word);
  }

  /**
   *
   * @param words {Array} raw word
   */
  async function buildWords(words) {

    let rs = {
      isOk: true,
      message: 'Result from build-words function.',
      data: null
    };

    logger.info('[ctrl-word-builder] Start building -> ' + words.join(' - '));
    let data = await wordBuilderService.build(words);
    rs.data = data;

    return Promise.resolve(rs)
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

  module.exports = new WordBuilderController();

})();