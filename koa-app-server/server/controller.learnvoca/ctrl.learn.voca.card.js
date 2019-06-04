/**
 * Created by locnv on 10/14/18.
 */

const CtrlConst = require('../controller/ctrl.constants');
const dsCard = require('../database/ds.card');
const dsTopic = require('../database/ds.topic');
const dsWord = require('../database/ds.word');
const dsTopicWord = require('../database/ds.topic.word');
const vocabHelper = require('./ctrl.learn.voca.helper');
const fs = require('fs');
const path = require('path');

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
  let topic;
  switch (action) {
    case Actions.GetTopicById:
      let topicId = query.topicId;
      topic = await getTopicById(topicId);
      retObj.data = topic;
      break;
    case Actions.GetTopicByName:
      let name = query.topicName;
      topic = await getTopicByName(name);
      retObj.data = topic;
      break;
    case Actions.GetAllTopics:
      let topics = await getAllTopics();
      retObj.data = topics;
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

  let topicId;
  switch(action) {

    case Actions.CreateTopic:
      let topicName = reqData.name;
      let description = reqData.description;
      let baseWords = reqData.baseWords;
      let createdRs = await createTopic(topicName, description, baseWords);
      retObj.isSuccess = createdRs.isOk;
      retObj.data = createdRs.data;
      retObj.message = createdRs.message;
      break;
    case Actions.DeleteTopic:
      topicId = reqData.topicId;
      let deleteRs = await deleteTopicById(topicId);
      retObj.isSuccess = deleteRs.isOk;
      retObj.data = deleteRs.data;
      retObj.message = deleteRs.message;
      break;
    case Actions.AddWordToTopic:
      topicId = reqData.topicId;
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

    case Actions.DownloadTopic:
      let readableStream = fs.createReadStream('/Users/locnv/Documents/projects/koa-app/koa-app-server/server/word-builder/base/topic/topic-5cecc4d04950e65b22618e05.csv');
      retObj.data = readableStream;
      retObj.isStream = true;
      break;

    case Actions.ExportTopic:
      let topicIdToExport = reqData.topicId;
      let exportRs = await exportTopic(topicIdToExport);
      retObj.data = exportRs;
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

async function exportTopic(topicId) {

  logger.info(`[topic] Going to export ${topicId}`);
  let exportRs = await vocabHelper.exportTopic(topicId);

  if(exportRs.isOk) {
    let outPath = exportRs.data;
    exportRs.fileName = path.basename(outPath);
  }

  return Promise.resolve(exportRs);
}

async function createTopic(name, description, baseWords) {
  logger.warn(`[topic] [create-topic] -> topic name = ${name}`);

  let rs = {
    isOk: true,
    data: null,
    message: ''
  };

  let dbTopic = await dsTopic.find({ name: name });
  if(dbTopic.length > 0) {
    logger.info(`Topic already existed -> ${JSON.stringify(dbTopic[0])}`);
    rs.isOk = false;
    rs.data = dbTopic;
    rs.message = 'Topic is already existed.';
    return rs;
  }

  let createdTopic = await dsTopic.create({
    name: name,
    description: description
  });

  logger.info('Created topic -> ' +JSON.stringify(createdTopic));
  rs.data = createdTopic;

  if(baseWords && baseWords.length > 0) {
    for(var i = 0; i < baseWords.length; i++) {
      let w = baseWords[i];
      logger.info('Going to add word -> ' +w +' into topic -> ' + createdTopic._id);
      let wDb = await dsWord.find({ name: w });
      if(Array.isArray(wDb)) {
        wDb = wDb[0];
      }

      if(!wDb) {
        logger.info(`word ${w} is not exit in db -> going to create.`);
        wDb = await dsWord.create({ name: w });
        logger.info(`Create new word -> ${JSON.stringify(wDb)}`);
      } else {
        logger.info(`word ${w} is already exit in db -> ${JSON.stringify(wDb)}`);
      }

      await addWordToTopic(createdTopic._id, wDb._id);

      logger.info(`Create topic-word -> ${createdTopic._id} / ${wDb._id}`);

    }
  }

  return rs;
}

async function deleteTopicById(topicId) {
  logger.warn(`[topic] [delete-topic] -> topic id = ${topicId}`);

  let rs = {
    isOk: true,
    data: null,
    message: ''
  };

  let dbTopic = await dsTopic.find({ _id: dsTopic.toObjectId(topicId) });
  if(!dbTopic) {
    rs.isOk = false;
    rs.message = `Topic ${topicId} does not exist.`;
    return rs;
  }

  await dsTopicWord.deleteMany({
    topic: dsTopicWord.toObjectId(topicId)
  });

  await dsTopic.delete(topicId);

  rs.message = 'Deleted topic and linked words';

  return rs;
}

async function getTopicById(topicId) {
  logger.warn(`[topic] [get-topic] -> topic id = ${topicId} `);

  let dbTopics = await dsTopic.find({ _id: topicId });

  return (dbTopics.length > 0 ? dbTopics[0] : null);
}

async function getTopicByName(topicName) {
  logger.warn(`[topic] [get-topic] -> topic name = ${topicName} `);

  let dbTopics = await dsTopic.find({ name: topicName });
  return (dbTopics.length > 0 ? dbTopics[0] : null);
}

async function getAllTopics() {
  logger.warn(`[topic] [get-topics] -> get all`);

  return await dsTopic.find({});
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