
(function() {
  "use strict";

  var util = require('util');
  var bleno = require('bleno');
  var logger = require('../util/logger');

  var fCallback = null;
  var self, mIsUpdating = false, mCounter = 0;

  function SampleCharacteristic() {
    self = this;
    bleno.Characteristic.call(this, {
      uuid: '13333333333333333333333333330003',
      properties: [ 'read', 'write', 'notify'],
      descriptors: [
        new bleno.Descriptor({
          uuid: '2901',
          value: 'Sample characteristic (01).'
        })
      ]
    });
  }

  util.inherits(SampleCharacteristic, bleno.Characteristic);

  SampleCharacteristic.prototype.onWriteRequest = onWriteRequest;
  SampleCharacteristic.prototype.onReadRequest = onReadRequest;
  SampleCharacteristic.prototype.onSubscribe = onSubscribe;
  SampleCharacteristic.prototype.onUnsubscribe = onUnsubscribe;

  module.exports = SampleCharacteristic;

  ////////////////////////////////////////////////////////////////
  //////// Implementation
  ////////////////////////////////////////////////////////////////

  function onWriteRequest(data, offset, withoutResponse, callback) {
    logger.info('characteristic-sample-1: onWriteRequest: ' + data.inspect());

    if (offset) {
      callback(self.RESULT_ATTR_NOT_LONG);
    } else {
      callback(self.RESULT_SUCCESS);
    }
  }

  function onReadRequest(offset, callback) {
    logger.info('characteristic-1: onReadRequest');
    if (offset) {
      logger.debug("[DEBUG] > RESULT_ATTR_NOT_LONG.");
      callback(self.RESULT_ATTR_NOT_LONG, null);
    } else {
      var buffer = new Buffer(1);
      buffer.writeUInt8(0x00, 0);
      callback(self.RESULT_SUCCESS, buffer);
    }
  }

  /**
   * Subscribe
   *
   * @param maxValueSize
   *            maximum data size
   * @param updateValueCallback
   *            callback to call when value has changed
   */
  function onSubscribe(maxValueSize, updateValueCallback) {
    logger.info('characteristic-1: onSubscribe');
    fCallback = updateValueCallback;

    startUpdate();
  }

  function onUnsubscribe() {
    logger.info('characteristic-sample-1: onUnSubscribe');
    stopUpdate();
    fCallback = null;
  }

  function startUpdate() {
    logger.info('Update');

    if(mIsUpdating) {
      logger.info('Already started.');
      return;
    }

    mIsUpdating = true;

    doUpdate();
  }

  function stopUpdate() {
    mIsUpdating = false;
  }

  function doUpdate() {
    if(!mIsUpdating) { // It's all gone!
      return;
    }

    logger.info('Updated @' + new Date());

    var buffer = new Buffer(1);
    buffer.writeUInt8((++mCounter), 0);
    fCallback(buffer);

    setTimeout(doUpdate, 2000);
  }

})();
