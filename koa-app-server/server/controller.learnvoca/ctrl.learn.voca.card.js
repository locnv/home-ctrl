/**
 * Created by locnv on 10/14/18.
 */

const CtrlConst = require('../controller/ctrl.constants');
const dsCard = require('../database/ds.card');
const dsTopic = require('../database/ds.topic');
const dsTopicWord = require('../database/ds.topic.word');

const logger = require('../util/logger');

const Method = CtrlConst.Method;
const Actions = CtrlConst.Actions;

function CardController() { }

CardController.prototype.handle = async function (req, params, query) {

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
    controller: 'card',
    method: 'handleGet',
  };

  let action = parseInt(query.action);
  
  switch (action) {
    case Actions.GetTopicByName:
      let name = query.topicName;
      let topic = await getTopicByName(name);
      retObj.data = topic;
      break;
    default:
        retObj.isSuccess = false;
        break;
  }

  return Promise.resolve(retObj);
}

async function handlePost(req, params) {
  let retObj = {
    isSuccess: true
  };

  let body = req.body;
  let reqData = body.data;
  let action = body.action;

  switch(action) {

    case Actions.CreateTopic:
      let topicName = reqData.name;
      let description = reqData.description;
      let createdTopic = await createTopic(topicName, description);
      retObj.data = createdTopic;
      break;
    case Actions.AddWordToTopic:
      let topicId = reqData.topicId;
      let wordId = reqData.wordId;
      let rs = await addWordToTopic(topicId, wordId);
      retObj.data = rs;

      break;
    case Actions.RemoveWordFromTopic:
      let topicId1 = reqData.topicId;
      let wordId1 = reqData.wordId;
      let createdTW = await removeWordFromTopic(topicId1, wordId1);
      retObj.data = createdTW;
      break;

    case Actions.CreateCard:
      let card = body.data;
      let isOk = addCard(card);
      break;
    case Actions.RemoveCard:
    case Actions.UpdateCard:
      break;

    default:
      retObj.isSuccess = false;
      break;
  }

  return Promise.resolve(retObj);
}

async function createTopic(name, description) {
  logger.warn(`[topic] [create-topic] -> topic name = ${name}`);

  let dbTopic = await dsTopic.find({ name: name });
  if(dbTopic.length > 0) {
    logger.info(`Topic already existed -> ${JSON.stringify(dbTopic[0])}`);
    return dbTopic;
  }

  let createdTopic = await dsTopic.create({
    name: name,
    description: description
  });

  return createdTopic;
}

async function getTopicByName(topicName) {
  logger.warn(`[topic] [get-topic] -> topic name = ${topicName} `);

  let dbTopics = await dsTopic.find({ name: topicName });
  let topic = dbTopics.length > 0 ? dbTopics[0] : null;

  return topic;
}

async function addWordToTopic(topicId, wordId) {
  logger.warn(`[topic] [add-word] -> topicId = ${topicId}; wordId = ${wordId}`);

  let dbTW = await dsTopicWord.find({ topic: topicId, word: wordId });

  if(Array.isArray(dbTW)) dbTW = dbTW[0];

  if(dbTW) {
    logger.warn(`[topic] [add-word] -> Already added -> ${JSON.stringify(dbTW)}`);
    return dbTW;
  }

  dbTW = await dsTopicWord.create({ topic: dsTopicWord.toObjectId(topicId), word: dsTopicWord.toObjectId(wordId) });

  return Promise.resolve(dbTW);
}

async function removeWordFromTopic(topicId, wordId) {

  logger.warn(`[topic] [remove-word] -> topicId = ${topicId}; wordId = ${wordId}`);

  let dbTW = await dsTopicWord.find({ topic: topicId, word: wordId });

  if(Array.isArray(dbTW)) dbTW = dbTW[0];

  if(!dbTW) {
    logger.warn(`[topic] [remove-word] -> Word is not belong to topic.`);
    return false;
  }

  dbTW = await dsTopicWord.delete(dbTW._id);

  return Promise.resolve(dbTW);

}

async function addCard(card) {

  let result = {
    error: null,
    attach: null,
  };
  let dbObj = await dsCard.create(card);

  if(dbObj instanceof Error) {
    result.error = dbObj;
  } else {
    result.attach = dbObj;
  }

  return result;
}

async function removeCard(cardId) {
  let result = {
    error: null,
    attach: null,
  };

  let dbObj = await dsCard.delete(cardId);

  if(dbObj instanceof Error) {
    result.error = dbObj;
  } else {
    result.attach = dbObj;
  }

  return result;
}

function updateCard(card) {

}

module.exports = new CardController();