/**
 * Created by locnv on 11/25/18.
 */

(function() {
  "use strict";

  let logger = require('../../util/logger');

  function Gpio(pinNb, config) {
    this.pin = pinNb;
    this.config = config;
    this.level = 0;

    logger.info(`[gpio][constructor] pin[${this.pin}]`);
  }

  Gpio.prototype.digitalWrite = digitalWrite;
  Gpio.prototype.digitalRead = digitalRead;
  Gpio.prototype.pwmWrite = pwmWrite;

  function digitalWrite(level) {
    logger.info(`[digitalWrite] pin[${this.pin}].req > ${level}`);

    setTimeout(applyNewValue.bind(this, level), 10);

  }

  function applyNewValue(level) {
    this.level = level;
    //logger.info(`[digitalWrite] pin[${this.pin}].${level}`);
  }

  function digitalRead() {
    return this.level;
  }

  function pwmWrite(level) {
    logger.info(`[pwmWrite] pin[${this.pin}].req > ${level}`);

    setTimeout(applyNewValue.bind(this, level), 10);
  }

  module.exports = {
    Gpio: Gpio
  };

})();
