/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  const DbBase = require('./mongoose/ds.base');
  const model = require('./model/card');
  const Name = 'Card';

  function DsCard() {
    this.uber('constructor');
    this.load(Name, model);
  }

  DsCard.inherits(DbBase);

  module.exports = new DsCard();

})();