/**
 * Created by locnv on 10/14/18.
 */
(function() {
  "use strict";

  const DbBase = require('./mongoose/ds.base');
  const model = require('./model/image');
  const Name = 'Image';

  function DsImage() {
    this.uber('constructor');
    this.load(Name, model);
  }

  DsImage.inherits(DbBase);

  module.exports = new DsImage();

})();