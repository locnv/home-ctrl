/**
 * Created by locnv on 10/20/18.
 */

(function() {
  "use strict";

  const dsCard = require('../server/database/ds.card');

  function Test() {
    console.log('====== Test Cards ====');
    this.testFindAll();
    this.testAddCard();

    console.log('====== Test Cards ====');
  }

  Test.prototype.testFindAll = function() {
    console.log('Test findAllCard');
  };

  Test.prototype.testAddCard = async function() {
    let t = new Date().getTime();
    let card = {
      name: 'card-' + t,
      description: 'Card description ' +t,
    };

    await dsCard.create(card);
  };

  module.exports = new Test();


})();