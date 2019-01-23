/**
 * Created by locnv on 10/14/18.
 */
(function() {
  "use strict";

  const DbBase = require('./mongoose/ds.base');
  const model = require('./model/word');
  const Name = 'Word';

  function DsWord() {
    this.uber('constructor');
    this.load(Name, model);
  }

  DsWord.inherits(DbBase);

  DsWord.prototype.findWordsByCard = function(cardId) {
    return this.uber('find', { card: cardId });
  };

  module.exports = new DsWord();

})();