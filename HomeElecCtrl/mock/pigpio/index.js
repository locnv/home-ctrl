/**
 * Created by locnv on 11/25/18.
 */

(function() {
  "use strict";

  function Gpio(pinNb, config) {
    this.pin = pinNb;
    this.config = config;
    this.level = 0;

    console.log(`[gpio][constructor] pin[${this.pin}]`);
  }

  Gpio.prototype.digitalWrite = digitalWrite;
  Gpio.prototype.digitalRead = digitalRead;
  Gpio.prototype.pwmWrite = pwmWrite;

  function digitalWrite(level) {
    console.log(`[digitalWrite] pin[${this.pin}].req > ${level}`);

    setTimeout(applyNewValue.bind(this, level), 10);

  }

  function applyNewValue(level) {
    this.level = level;
    //console.log(`[digitalWrite] pin[${this.pin}].${level}`);
  }

  function digitalRead() {
    return this.level;
  }

  function pwmWrite(level) {
    console.log(`[pwmWrite] pin[${this.pin}].req > ${level}`);

    setTimeout(applyNewValue.bind(this, level), 10);
  }

  module.exports = {
    Gpio: Gpio
  };

})();
