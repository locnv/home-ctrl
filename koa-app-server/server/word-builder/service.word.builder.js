/**
 * Created by locnv on 11/27/18.
 */

(function() {
  'use strict';

  const dicApi = require('./service.api.dic');
  const dsWordDb = require('../database/ds.word.db');
  const dsWord = require('../database/ds.word');
  const logger = require('../util/logger');

  var fs = require('fs');

  //https://www.npmjs.com/package/csv-reader
  var CsvReadableStream = require('csv-reader');

  let BaseWords = ['abstraction', 'reluctance', 'evaporate', 'sentience', 'stabber', 'illustration'];
  // const BaseWords = ['illustration'];

  let inst = {
    initialize: initialize,
    start: start,
    build: build,
    importBaseWord: importBaseWord
  };

  module.exports = inst;

  function initialize() {

    logger.info("initializing word-builder service.");
  }

  function importBaseWord() {
    let csvPath = '/Users/locnv/Documents/projects/koa-app/koa-app-server/server/word-builder/base/en-1000.csv';
    let inputStream = fs.createReadStream(csvPath, 'utf8');

    inputStream
    .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', async function (row) {
      //logger.info(`A row arrived: ${JSON.stringify(row)} -> ${ typeof row } -> isArray: ${ Array.isArray(row) }`);

      if(!Array.isArray(row) || row.length === 0) return;

      if(row[0] === '#ignore') return;

      try {
        let wBase = row[1];
        let word = await dsWord.findOne({ name: wBase });
        if(word !== null) {
          logger.info(`[word-builder] -> import base -> word existed: ${wBase}.`);
        } else {
          let createdWord = await dsWord.create({ name: wBase});
          logger.info(`[word-builder] -> import base -> Added: ${wBase}`);
        }
      } catch (e) {
        logger.error(`word-builder -> failed to import base word. Next ...`, e);
      }
    })
    .on('end', function (data) {
      logger.info('No more rows!' + JSON.stringify(data));
    });
  }

  async function build(words) {
    BaseWords = words;

    return await start('en-en');
  }

  /**
   *
   * @param wordDbName en-en, vi-en, vi-ja ...
   */
  async function start(wordDbName) {

    await checkAndCreateWordDb(wordDbName);

    let promise = new Promise(function(resolve, reject) {
      processWord(0, [], resolve, reject);
    });

    return promise;
  }

  async function checkAndCreateWordDb(name) {

    //let wordDb = await dsWordDb.find({ name: name });

    let found = null;
    let filter = { name: name};
    let wordDbs = await dsWordDb.find(filter);
    if(Array.isArray(wordDbs)) {
      found = wordDbs[0];
    }

    if(!found) {
      logger.info(`[checkAndCreateWordDb] -> Db ${name} is not available. Going to create it.`);
      let wordDb = {
        name: name,
        description: 'English - English dictionary.'
      };

      let dbObj = await dsWordDb.create(wordDb);
      logger.info(`[checkAndCreateWordDb] -> Created: ${stringify(dbObj)}`);
    } else {
      logger.info(`[checkAndCreateWordDb] -> Found: ${found.name} ${stringify(found)}`);
    }

  }

  async function processWord(idx, resp, onSuccess, onError) {

    if(idx >= BaseWords.length) {
      logger.info('[word-builder] -> finished!');
      onSuccess(resp);
      return;
    }

    if(!Array.isArray(resp)) resp = [];

    let baseWord = BaseWords[idx];
    logger.info(`[word-builder] -> querying ${baseWord}`);

    try {
      let isNew = true, needUpdate = false;
      let word = await dsWord.findOne({ name: baseWord });
      let wordId;
      if(word !== null) {
        isNew = false;
        wordId = word._id;

        if(!word.descriptions || word.descriptions.length === 0) {
          logger.info(`[word-builder] -> need update`);
          needUpdate = true;
        }
      }

      if(isNew || needUpdate) {
        word = await dicApi.query(baseWord);
        if(!word.descriptions || word.descriptions.length === 0) {
          word.descriptions = ['unknown'];
        }
        logger.info(`Get a word definition -> ${JSON.stringify(word)}`);
      }

      let dbWord;
      if(isNew) {
        dbWord = await dsWord.create(word);
        logger.info(`Added a word to db ${JSON.stringify(dbWord)}`);
      } else if(needUpdate) {
        word._id = wordId;
        dbWord = await dsWord.update(word);
        logger.info(`Updated a word to db ${JSON.stringify(dbWord)}`);
      }
      resp.push(word);

    } catch (e) {
      logger.error(`word-builder -> failed to get definition of ${baseWord}. Next ...`, e);
    }

    setTimeout(processWord.bind(null, idx+1, resp, onSuccess, onError), 1000);
  }

  function stringify(obj) {
    return JSON.stringify(obj)
  }

})();
