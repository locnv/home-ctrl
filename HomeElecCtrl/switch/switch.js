/**
 * Created by locnv on 11/4/18.
 */

(function() {
  "use strict";

  const logger = require('../util/logger');

  const ModuleString = {
    'linux': 'pigpio',
    'darwin': '../mock/pigpio'
  };
  const Platform = process.platform;
  logger.debug('loading switch on ' + Platform);

  const Gpio = require(ModuleString[Platform]).Gpio;

  /* Low / High */
  const LOW = 0, HI = 1;

  const Status = {
    On: LOW, Off: HI,
  };

  const Commands = {
    TurnOn: 'turn-on',
    TurnOff: 'turn-off',
    Schedule: 'schedule',
    RmSchedule: 'remove-schedule',
    AutoToggle: 'auto-toggle'
  };

  const OneSecond = 1000;
  const OneMinute = 60 * OneSecond;

  /**
   *
   * @param config {object}
   *  - name: {string}
   *  - pin: {number} io pin id
   *
   * @constructor
   */
  function Switch(config) {
    this.config = config;
    this.name = config.name || 'unnamed';
    this.id = config.id;
    this.status = Status.Off;
    this.reqStatus = null;
    this.io = new Gpio(config.pin, {mode: Gpio.OUTPUT});
    this.autoToggle = {
      active: false,
      onDelay: 30 * OneMinute,
      offDelay: 30 * OneMinute
    };

    logger.info(`[switch] ${this.name} on pin#${config.pin}`);
  }

  Switch.constant = {
    Status: Status,
    Commands: Commands
  };

  Switch.prototype.initialize = initialize;
  Switch.prototype.turnOn = turnOn;
  Switch.prototype.turnOff = turnOff;
  Switch.prototype.scheduleTask = scheduleTask;
  Switch.prototype.setAutoToggleMode = setAutoToggleMode;
  Switch.prototype.updateStatus = updateStatus;

  function initialize() {
    this.updateStatus();
  }

  function turnOn() {
    logger.info(`[switch][${this.name}] Turn On.`);
    this.io.digitalWrite(Status.On);
    this.reqStatus = Status.On;
    this.updateStatus();
  }

  function turnOff() {
    logger.info(`[switch][${this.name}] Turn Off.`);
    this.io.digitalWrite(Status.Off);
    this.reqStatus = Status.Off;

    this.updateStatus();
  }

  function updateStatus() {
    function Fn() {
      let level = this.io.digitalRead();
      //logger.info(`[switch][${this.name}] Current level: ${level}.`);

      if(level === Status.On || level === Status.Off) {
        this.status = level;
      }
    }

    setTimeout(Fn.bind(this), 100);
  }

  function scheduleTask(status, delay) {

    logger.info(`[switch][${this.name}] schedule. status#${status}.${delay}.`);

    let fn = null;
    if(status === Status.On) {
      fn = turnOn;
    } else if(status === Status.Off) {
      fn = turnOff;
    }

    if(fn === null) {
      return;
    }

    if(this.task) {
      clearTimeout(this.task);
      logger.info(`[switch][${this.name}] clear a timer ${this.task}`);
    }

    this.task = setTimeout(fn.bind(this), delay);
  }

  /**
   *
   * @param isEnabled
   * @param onDelay {number} nb of seconds
   * @param offDelay {number} nb of seconds
   */
  function setAutoToggleMode(isEnabled, onDelay, offDelay) {
    this.autoToggle.active = isEnabled;
    this.autoToggle.onDelay = onDelay * OneSecond;
    this.autoToggle.offDelay = offDelay * OneSecond;

    if(isEnabled) {
      runAutoToggle.call(this, Status.On);
    }
  }

  function runAutoToggle(status) {

    if(!this.autoToggle.active) {
      logger.info(`[switch]#${this.name}.autoToggle is off.`);
      return;
    }

    logger.info(`[switch] #${this.name}: autoToggle is trigger. Status=${status}.`);
    let nextDelay = 60 * OneMinute;
    let nextStatus = null;
    if(status === Status.On) {
      this.turnOn();
      nextStatus = Status.Off;
      nextDelay = this.autoToggle.offDelay;
    } else {
      this.turnOff();
      nextStatus = Status.On;
      nextDelay = this.autoToggle.onDelay;
    }

    this.autoToggle.timer = setTimeout(runAutoToggle.bind(this, nextStatus), nextDelay);

  }

  module.exports = Switch;

})();
