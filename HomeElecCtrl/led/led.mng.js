/**
 * Created by locnv on 11/4/18.
 */

(function() {
  "use strict";

  const EventEmitter = require('events').EventEmitter;
  const logger = require('../util/logger');
  const appUtil = require('../util/util');
  const Led = require('./led');
  const util = require('util');

  const Constants = {
    Event: {
      LedStatusChanged: 'led-status-changed'
    }
  };

  let SleepMode = {
    activeTime: 0,
    deActiveTime: 0,
  };

  /* Constructor */
  function LedManagement() {
    this.initialize();
    this.tmrUpdateStatus = null;
  }

  util.inherits(LedManagement, EventEmitter);

  LedManagement.prototype.constants = Constants;
  LedManagement.prototype.initialize = initialize;
  LedManagement.prototype.getAllLeds = getAllLeds;
  LedManagement.prototype.handleRemoteMessage = handleRemoteMessage;
  LedManagement.prototype.setLedStatus = setLedStatus;
  LedManagement.prototype.setLedMode = setLedMode;

  /* Initialize */
  function initialize() {
    logger.info('[led-mng] Initialized');

    this.leds = [];
    let DefOfLeds = require('./definition.json');
    for(let i = 0; i < DefOfLeds.length; i++) {
      let d = DefOfLeds[i];
      let led = new Led(d);
      led.initialize();
      this.leds.push(led);
    }

  }

  function raiseLedStatusChanged(led) {

    this.emit(Constants.Event.LedStatusChanged, led);

  }

  /**
   * Retrive all available switches
   *
   * @return {properties.switches|{enum}|Array|[*,*]|*}
   */
  function getAllLeds() {
    return this.leds;
  }

  /**
   * Handle remote messages:
   *
   * 1. set-color
   *
   * 2. set-mode
   *
   * @param message
   */
  function handleRemoteMessage(message) {

    let ledId = message.ledId;
    let command = message.command;

    let LedCommands = Led.constant.Commands;

    switch(command) {

      case LedCommands.SetColor:
        let r = message.r,
          g = message.g,
          b = message.b;

        this.setLedStatus(ledId, r, g, b);

        break;

      case LedCommands.SetMode:
        let m = message.mode;
        // interval shall not be available for LeModes.None
        let interval = message.interval;
        if(!interval) {
          interval = 1000;
        }

        this.setLedMode(ledId, m, interval);
        break;

      default:
        logger.warn(`[led-mng] Invalid command: ${command}`);
        break;
    }

  }

  function setLedMode(ledId, mode, interval) {
    logger.debug(`[led-mng] set LED mode: L[${ledId}].M[${mode}]`);

    let led = findLed.call(this, ledId);
    if(!led) {
      logger.warn(`[led-mng] setLedMode> LED Not Found [${ledId}]`);
      return false;
    }

    led.setMode(mode, interval);

    setTimeout(raiseLedStatusChanged.bind(this, led), 100);

  }

  function setLedStatus(ledId, r, g, b) {
    logger.debug(`[led-mng] set LED status: L[${ledId}][${r}, ${g}, ${b}]`);

    let led = findLed.call(this, ledId);
    if(!led) {
      logger.warn(`[led-mng] setLedStatus> LED Not Found [${ledId}]`);
      return false;
    }

    led.setColor(r, g, b);

    setTimeout(raiseLedStatusChanged.bind(this, led), 100);

  }

  function findLed(ledId) {

    let found = null;
    let leds = this.leds;

    for(let i = 0; i < leds.length; i++) {
      let l = leds[i];
      if(l.id === ledId) {
        found = l;
        break;
      }
    }

    return found;
  }

  module.exports = LedManagement;

})();
