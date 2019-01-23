/****/
(function() {

  "use strict";


  /* global require */
  let util = require('util');
  let bleno = require('bleno');
  let logger = require('../util/logger');

  let GattServerName = 'HomeElecBleProfile';

  let BleService = require('./service-01');
  let bleService = new BleService();

  function BleManagement() { }

  BleManagement.prototype.start = start;
  BleManagement.prototype.stop = stop;

  function start() {

    bleno.on('stateChange', function(state) {
      logger.info('ble:stateChange > ', state);

      if(state === 'poweredOn') {
        bleno.startAdvertising(GattServerName, [ bleService.uuid ], function(err) {
          if (err) {
            logger.error(err);
          }
        })
      } else {
        bleno.stopAdvertising();
      }
    });

    bleno.on('advertisingStart', function(err) {
      logger.info('advertisingStart.');

      if (!err) {
        bleno.setServices([
          pizzaService
        ]);
      } else {
        logger.error('An error occurs during advertising start.', err);
      }
    });

    bleno.on('advertisingStartError', function onError(err) {
      logger.error('advertisingStartError', err);
    });

    bleno.on('advertisingStop', function() {
      logger.info('advertisingStop');
    });

    bleno.on('servicesSet', function(err) {
      logger.info('serviceSet');
    });

    bleno.on('servicesSetError', function (err) {
      logger.info('serviceSetError', err);
    });

    // not available on OS X 10.9
    bleno.on('accept', function(clientAddress) {
      logger.info('accept: ' + clientAddress);
    });

    // Linux only
    bleno.on('disconnect', function (clientAddress) {
      logger.info('disconnect from ' + clientAddress);
    });
  }

  function stop() {

  }

  module.exports = new BleManagement();

})();
