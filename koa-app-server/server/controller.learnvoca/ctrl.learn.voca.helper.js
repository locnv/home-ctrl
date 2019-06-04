/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  const CtrlConst = require('../controller/ctrl.constants');
  const dsWord = require('../database/ds.word');
  const dsCard = require('../database/ds.card');
  const dsTopicWord = require('../database/ds.topic.word');
  const fs = require('fs');
  const CsvWriter = require('csv-write-stream');


  function VocabHelper() { }

  VocabHelper.prototype.getWordsByTopic = async function(topicId) {

    let topicWords = await dsTopicWord.findWordsByTopic(topicId);

    if(!Array.isArray(topicWords) || topicWords.length === 0) {
      return null;
    }

    let wordIds = [];
    topicWords.forEach(function(tw) {
      wordIds.push(tw.word);
    });

    return await dsWord.findByIds(wordIds);

  };

  VocabHelper.prototype.exportTopic = async function(topicId) {
    let words = await this.getWordsByTopic(topicId);

    let csvWriter = CsvWriter();
    let outPath = `/Users/locnv/Documents/projects/koa-app/koa-app-server/server/word-builder/base/topic/topic-${topicId}.csv`;

    let rs = {
      isOk: true,
      data: outPath
    };
    csvWriter.pipe(fs.createWriteStream(outPath));

    console.log(`export -> ${outPath}`);
    console.log(`export -> working dir -> ${__dirname}`);

    let counter = 0;
    words.forEach(function(word) {
      let wOut = {
        number: counter++,
        name: word.name,
        type: word.type,
        pronounce: word.pronunciation,
        description: getDefinition(word, true),
        example: getExamples(word, true),
        url: word.imageUrl
      };

      csvWriter.write(wOut);
    });

    return Promise.resolve(rs);

  };

  function getDefinition(word, isEnglish) {
    if(!word) return '';

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

  module.exports = new VocabHelper();

})();