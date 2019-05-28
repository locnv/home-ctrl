/**
 * Created by locnv on 11/27/18.
 */

(function() {
  'use strict';

  const dicApi = require('./service.api.dic');
  const dsWordDb = require('../database/ds.word.db');
  const dsWord = require('../database/ds.word');
  const logger = require('../util/logger');
  const path = require('path');

  var fs = require('fs');

  //https://www.npmjs.com/package/csv-reader
  let CsvReadableStream = require('csv-reader');
  //var CreateCsvWriter = require('csv-writer').createObjectCsvWriter;
  let CsvWriter = require('csv-write-stream');

  let BaseWords = ['abstraction', 'reluctance', 'evaporate', 'sentience', 'stabber', 'illustration'];
  // const BaseWords = ['illustration'];

  let inDir = '/Users/locnv/Documents/projects/koa-app/koa-app-server/server/word-builder/base/common-1000';
  let outDir = '/Users/locnv/Documents/projects/koa-app/koa-app-server/server/word-builder/base/common-out-1000';
  let csvFiles = [
    // 'word_cs1000.csv',
    // 'word_da1000.csv',
    // 'word_de1000.csv',
    // 'word_el1000.csv',
    'word_en1000.csv',
    // 'word_et1000.csv',
    // 'word_fi1000.csv',
    // 'word_fil1000.csv',
    // 'word_fr1000.csv',
    // 'word_hi1000.csv',
    // 'word_hu1000.csv',
    // 'word_in1000.csv',
    // 'word_it1000.csv',
    'word_ja1000.csv',
    // 'word_km1000.csv',
    // 'word_ko1000.csv',
    // 'word_nb1000.csv',
    // 'word_nl1000.csv',
    // 'word_pl1000.csv',
    // 'word_pt1000.csv',
    // 'word_ro1000.csv',
    // 'word_ru1000.csv',
    // 'word_si1000.csv',
    // 'word_sk1000.csv',
    // 'word_su1000.csv',
    // 'word_sv1000.csv',
    // 'word_th1000.csv',
    // 'word_tr1000.csv',
    // 'word_uk1000.csv',
    'word_vn1000.csv',
    //'word_zh1000.csv'
  ];

  let inst = {
    initialize: initialize,
    start: start,
    build: build,
    importBaseWord: importBaseWord,

    exportDic: exportDic,
  };

  module.exports = inst;

  function initialize() {

    logger.info("initializing word-builder service.");
  }

  //setTimeout(exportAllDic.bind(null, 0), 1000);

  function exportAllDic(idx) {

    if(idx >= csvFiles.length) {
      logger.info(`[word-builder] Export all dics done -> ${idx}!`);
      return;
    }

    let csvFile = csvFiles[idx];
    logger.info(`[word-builder] -> exporting -> ${csvFile}`);

    let isEnglish = (csvFile.indexOf('en1000') !== -1);

    let filePath = path.resolve(inDir, csvFile);
    exportDic(filePath, isEnglish, exportAllDic.bind(null, idx+1));

  }

  /**
   * Export a specific dictionary
   *
   * @param baseCsvPath
   * @param isEnglish {Boolean} if is true, export full info include:
   *  type, pronounciation, multiple definitions, multiple examples.
   * @param onDone
   */
  function exportDic(baseCsvPath, isEnglish, onDone) {

    let inFileName = path.basename(baseCsvPath);
    let outPath = path.resolve(outDir, inFileName);

    logger.info(`[word-builder] -> out -> ${outPath}`);

    //#ignore,#,name,type,pronounce,description,examples,url
    let csvWriter = CsvWriter();
    csvWriter.pipe(fs.createWriteStream(outPath));

    let inputStream = fs.createReadStream(baseCsvPath, 'utf8');
    let counter = 0;

    inputStream
      .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
      .on('data', async function (row) {

        if(!Array.isArray(row) || row.length === 0) return;

        if(row[0] === '#ignore' || row[0] === 'Number') return;

        try {
          let wTarget = row[1], wEnglish = row[4];
          let word = await dsWord.findOne({ name: wEnglish });

          if(word === null || word.descriptions === null || word.descriptions.length === 0) {
            // Dev: Not export empty
            return;
          }

          if(word === null) {
            logger.warn(`[word-builder] -> exportDic -> not found base definition in English for : ${wEnglish}.`);
          } else {
            let wOut = {
              number: counter++,
              name: wTarget,
              type: getWordType(word, isEnglish),
              pronounce: getPronunciation(word, isEnglish),
              description: getDefinition(word, isEnglish),
              example: getExamples(word, isEnglish),
              url: word.imageUrl
            };

            logger.info(`[word-builder] -> exporting: ${wTarget} -> ${wEnglish}`);

            csvWriter.write(wOut);
          }

        } catch (e) {
          logger.error(`word-builder -> failed to export dictionary -> ${e.message}`);
        }
      })
      .on('end', function (data) {
        logger.info('No more rows!' + JSON.stringify(data));
        //csvWriter.end();
      });

    setTimeout(onDone, 3000);

  }

  function getWordType(word, isEnglish) {
    if(!word) return '';

    return isEnglish ? word.type : '';
  }

  function getPronunciation(word, isEnglish) {
    if(!word) return '';

    return isEnglish ? word.pronunciation : '';
  }

  function getDefinition(word, isEnglish) {
    if(!word) return '';

    //if(!isEnglish) return word.name;

    let definitions = word.descriptions;

    if(typeof definitions === 'string') return definitions;

    if(!Array.isArray(definitions)) return definitions.toString();

    if(definitions.length === 0) return word.name;

    if(!isEnglish) return (`[${word.name}] ${definitions[0]}`);

    return definitions.join('; ');

  }

  function getExamples(word, isEnglish) {
    if(!word || !isEnglish) return '';

    let examples = word.examples;

    if(typeof examples === 'string') return examples;

    if(!Array.isArray(examples)) return examples.toString();

    if(examples.length === 0) return '';

    return examples.join(';');

  }

  function importBaseWord(csvPath) {
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
