/**
 * Created by locnv on 12/6/18.
 */

(function() {
  "use strict";

  const logger = require('../util/logger');

  const ModuleString = {
    'linux': 'pigpio',
    'darwin': '../mock/pigpio'
  };
  const Platform = process.platform;
  logger.debug('loading led on ' + Platform);

  const Gpio = require(ModuleString[Platform]).Gpio;

  const Commands = {
    SetColor: 'set-color',
    SetMode: 'set-mode'
  };

  const Modes = {
    None: 0,
    Blink: 1,
    Chase: 2,
    Dim: 3
  };

  /**
   *
   * @param config {object}
   *  - name: {string}
   *  - pin: {number} io pin id
   *
   * @constructor
   */
  function Led(config) {
    this.config = config;
    this.name = config.name || 'unnamed';
    this.id = config.id;
    this.mode = Modes.None;
    this.blinkCfg = {
      interval: 1000,
      status: 0
    };
    this.dimCfg = {
      interval: 20,
      direction: 1,
      status: [0, 0, 0]
    };
    this.chaseCfg = {
      interval: 1000,
      status: [0, 1, 1]
    };
    this.updateThread = null;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.reqStatus = null;
    this.ioR = new Gpio(config.pinR, {mode: Gpio.OUTPUT});
    this.ioG = new Gpio(config.pinG, {mode: Gpio.OUTPUT});
    this.ioB = new Gpio(config.pinB, {mode: Gpio.OUTPUT});

    logger.info(`[led] ${this.name} on pin#[${config.pinR},${config.pinG},${config.pinB}]`);
  }

  Led.constant = {
    Commands: Commands,
    Modes: Modes
  };

  Led.prototype.initialize = initialize;
  Led.prototype.setColor = setColor;
  Led.prototype.getColor = getColor;
  Led.prototype.setMode = setMode;

  /* Implementation */


  function initialize() {
    this.setColor(255, 255, 255);
  }

  function setColor(r, g, b) {
    //logger.info(`[led][${this.name}] Set color. RGB=[${r}, ${g}, ${b}]`);

    this.ioR.pwmWrite(r);
    this.ioG.pwmWrite(g);
    this.ioB.pwmWrite(b);

    this.r = r;
    this.g = g;
    this.b = b;

  }

  function getColor() {

    return {
      r: this.r,
      g: this.g,
      b: this.b
    };

  }

  function setMode(mode, interval) {
    if(!isValidMode(mode)) {
      logger.warn(`[led][${this.name}] > Failed to sed mode. Invalid mode (${mode})`);
      return;
    }

    logger.info(`[led][${this.name}] > set mode: [${mode}]`);
    this.mode = mode;

    if(this.updateThread) {
      clearTimeout(this.updateThread);
      this.updateThread = 0;
    }

    if(mode === Modes.Blink) {
      startBlink.call(this, interval);
    } else if(mode === Modes.Chase) {
      startChase.call(this, interval);
    } else if(mode === Modes.Dim) {
      startDim.call(this, interval);
    }
  }

  function isValidMode(mode) {
    return (
      mode === Modes.None ||
      mode === Modes.Dim ||
      mode === Modes.Chase ||
      mode === Modes.Blink)
  }

  function startBlink(interval) {
    this.blinkCfg.interval = interval;

    logger.debug('blink interval > ' + this.blinkCfg.interval );

    doBlink.call(this);
  }

  function startChase(interval) {
    this.chaseCfg.interval = interval;

    doChase.call(this);
  }

  function startDim(interval) {
    this.dimCfg.interval = interval;

    doDim.call(this);
  }

  function doBlink() {

    if(this.mode !== Modes.Blink) {
      return;
    }

    let blinkStatus = this.blinkCfg.status;
    let next = (blinkStatus === 0) ? 255 : 0;
    this.blinkCfg.status = next;

    this.setColor(next, next, next);

    this.updateThread = setTimeout(doBlink.bind(this), this.blinkCfg.interval);

  }

  function doChase() {

    if(this.mode !== Modes.Chase) {
      return;
    }

    let chaseStatus = this.chaseCfg.status;
    let first = chaseStatus.shift();
    chaseStatus.push(first);

    let r = chaseStatus[0] ? 255 : 0;
    let g = chaseStatus[1] ? 255 : 0;
    let b = chaseStatus[2] ? 255 : 0;

    this.setColor(r, g, b);

    this.updateThread = setTimeout(doChase.bind(this), this.chaseCfg.interval);

  }

  function doDim() {

    if(this.mode !== Modes.Dim) {
      return;
    }

    let dimStatus = this.dimCfg.status;
    let dir = this.dimCfg.direction;
    let v = dimStatus[0];
    v += (dir * 5);

    if((dir === 1 && v > 255) || (dir === -1 && v < 0)) {
      dir *= -1;
      this.dimCfg.direction = dir;
      v += (dir * 5);
    }

    dimStatus[0] = v;
    dimStatus[1] = v;
    dimStatus[2] = v;

    this.setColor(v, v, v);

    this.updateThread = setTimeout(doDim.bind(this), this.dimCfg.interval);
  }

  module.exports = Led;

})();
