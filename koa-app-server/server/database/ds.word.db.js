/**
 * Created by locnv on 10/14/18.
 */
(function() {
  "use strict";

  const DbBase = require('./mongoose/ds.base');
  const model = require('./model/word.db');
  const Name = 'WordDb';

  function DsWordDb() {
    this.uber('constructor');
    this.load(Name, model);
  }

  DsWordDb.inherits(DbBase);

  //DsWordDb.prototype.findWordsByCard = function(cardId) {
  //  return this.uber('find', { card: cardId });
  //};

  module.exports = new DsWordDb();

})();