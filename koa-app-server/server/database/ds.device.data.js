/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  const DbBase = require('./mongoose/ds.base');
  const model = require('./model/device.data');
  const Name = 'device.data';

  function DsService() {
    this.uber('constructor');
    this.load(Name, model);
  }

  DsService.inherits(DbBase);

  DsService.prototype.addData = addData;

  /**
   * Insert a device data
   * @param devId {String} device's identifier, not db's id
   * @param data {Object}
   */
  function addData(devId, data) {

  }

  module.exports = new DsService();

})();
