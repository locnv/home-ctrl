/**
 * Created by locnv on 10/20/18.
 */

(function() {
  "use strict";

  const dsWord = require('../server/database/ds.word');

  function Test() {
    console.log('====== Test Words ====');
    this.testFindAll();
    this.testAddWord();

    console.log('====== Test Words ====');
  }

  Test.prototype.testFindAll = function() {
    console.log('Test findAllWords');
  };

  Test.prototype.testAddWord = async function() {
    let t = new Date().getTime();
    let word = {
      card: '5bca9bc2695ef7a84cba0d26',
      name: 'word-' + t,
      description: 'Word description ' +t,
      example: 'An example ' +t,
    };

    await dsWord.create(word);
  };

  module.exports = new Test();


})();