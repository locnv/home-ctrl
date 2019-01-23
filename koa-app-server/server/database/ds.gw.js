/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  const DbBase = require('./mongoose/ds.base');
  const model = require('./model/gw');
  const Name = 'gw';

  function DsService() {
    this.uber('constructor');
    this.load(Name, model);
  }

  DsService.inherits(DbBase);

  module.exports = new DsService();

})();
