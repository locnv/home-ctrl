
/* global require */
/* global module */

var util = require('util');
var bleno = require('bleno');
var PizzaCrustCharacteristic = require('./characteristic-sample-01');
var PizzaCrustCharacteristic1 = require('./characteristic-sample-02');

(function() {
  "use strict";

  function ServiceSample01() {

    bleno.PrimaryService.call(this, {
      uuid: '13333333333333333333333333333337',
      characteristics: [
        new PizzaCrustCharacteristic(),
        new PizzaCrustCharacteristic1(),
      ]
    });
  }

  util.inherits(ServiceSample01, bleno.PrimaryService);

  module.exports = ServiceSample01;

})();

