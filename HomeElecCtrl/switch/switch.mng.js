/**
 * Created by locnv on 11/4/18.
 */

(function() {
  "use strict";

  const EventEmitter = require('events').EventEmitter;
  const logger = require('../util/logger');
  const appUtil = require('../util/util');
  const Switch = require('./switch');
  const SwitchStatus = Switch.constant.Status;
  const SwitchCommands = Switch.constant.Commands;
  const util = require('util');

  const DevError = require('../app.constant').DeviceError;

  const devDbService = require('../database/ds.device');


  const Constants = {
    Event: {
      SwitchStatusChanged: 'switch-status-changed'
    }
  };

  /* Constructor */
  function SwitchManagement() {
    this.initialize();
    this.tmrUpdateStatus = null;
  }

  util.inherits(SwitchManagement, EventEmitter);

  SwitchManagement.prototype.constants = Constants;
  SwitchManagement.prototype.initialize = initialize;
  SwitchManagement.prototype.getAllSwitches = getAllSwitches;
  SwitchManagement.prototype.addSwitch = addSwitch;
  SwitchManagement.prototype.handleRemoteMessage = handleRemoteMessage;
  SwitchManagement.prototype.setSwitchStatus = setSwitchStatus;
  SwitchManagement.prototype.scheduleSwitch = scheduleSwitch;

  SwitchManagement.prototype.scheduleSwitch1 = scheduleSwitch1;
  SwitchManagement.prototype.removeSchedule = removeSchedule;
  SwitchManagement.prototype.changeSwitchAutoToggle = changeSwitchAutoToggle;

  /* Initialize */
  function initialize() {
    logger.info('[switch-mng] Initialized');

    this.switches = [ ];
    let DefOfSwitches = require('./definition.json');
    for(let i = 0; i < DefOfSwitches.length; i++) {
      let d = DefOfSwitches[i];
      let sw = new Switch(d);
      sw.initialize();
      this.switches.push(sw);
    }

    // Test
    /*let fSW = this.switches[0];
    let n = new Date().getTime();
    let delay = 30*60*1000; // 30 minutes.
    fSW.plans = [
      {
        id: appUtil.generateUuid(),
        switchId: fSW.switchId,
        command: SwitchCommands.TurnOff,
        time: n + delay
      }, {
        id: appUtil.generateUuid(),
        switchId: fSW.switchId,
        command: SwitchCommands.TurnOn,
        time: n + 2*delay
      }
    ];*/

  }

  function reloadAllSwitchStatus() {

    if(this.tmrUpdateStatus !== null) {
      clearTimeout(this.tmrUpdateStatus);
    }

    let isAllUpdated = true;
    let hasStatusChanged = false;

    for(let i = 0; i < this.switches.length; i++) {
      let sw = this.switches[i];

      if(sw.reqStatus === null) {
        continue;
      }

      if(sw.reqStatus === sw.status) {
        hasStatusChanged = true;
        sw.reqStatus = null;
        this.emit(Constants.Event.SwitchStatusChanged, sw);
      } else {
        sw.updateStatus();
        isAllUpdated = false;
      }
    }

    if(isAllUpdated) {
      return;
    }

    this.tmrUpdateStatus = setTimeout(reloadAllSwitchStatus.bind(this), 100);

  }

  /**
   * Retrieve all available switches
   *
   * @return {properties.switches|{enum}|Array|[*,*]|*}
   */
  function getAllSwitches() {
    return this.switches;
  }

  async function addSwitch(dev) {

    if(dev.pins && dev.pins.length > 1) {
      throw new Error('Too many pins. Switch device accepts 1 and onely 1 pin.');
    }

    let exitDev = null;
    try {
      exitDev = await devDbService.find({ devType: dev.devType });
    } catch (e) { }

    if(exitDev) {
      return DevError.DevExist;
    }


    try {
      return await devDbService.create(dev);
    } catch (e) {
      throw new Error('An error occurs while adding new switch. See log for more detail.');
    }

  }

  function handleRemoteMessage(message) {

    let switchId = message.switchId;
    let command = message.command;

    let Status = Switch.constant.Status;
    let SwitchCommands = Switch.constant.Commands;

    switch(command) {

      case SwitchCommands.TurnOn:
        this.setSwitchStatus(switchId, Status.On);
        break;

      case SwitchCommands.TurnOff:
        this.setSwitchStatus(switchId, Status.Off);
        break;

      case SwitchCommands.Schedule:
        let subCmd = message.subCommand;
        let nStatus = (subCmd === SwitchCommands.TurnOn) ? Status.On : Status.Off;
        let delay = message.delay;
        this.scheduleSwitch(switchId, nStatus, delay);
        break;

      case SwitchCommands.RmSchedule:
        logger.warn(`[switch-mng] Rm-Schedule command: ${message}`);
        let planId = message.planId;
        let hasRemoved = this.removeSchedule(switchId, planId);
        if(hasRemoved) {
          runNext.call(this);
        }

        break;

      case SwitchCommands.AutoToggle:
        let isActive = message.isActive,
          onDelay = message.onDelay,
          offDelay = message.offDelay;

        this.changeSwitchAutoToggle(switchId, isActive, onDelay, offDelay);

        break;

      default:
        logger.warn(`[switch-mng] Invalid command: ${command}`);
        break;
    }

  }

  function scheduleSwitch(switchId, status, delay) {

    let sw = findSwitch.call(this, switchId);
    if(!sw) {
      return;
    }

    let plans = sw.plans;
    if(!plans) {
      plans = [];
      sw.plans = plans;
    }

    let n = new Date().getTime();
    let plan = {
      id: appUtil.generateUuid(),
      switchId: switchId,
      command: (status === SwitchStatus.On) ? SwitchCommands.TurnOn : SwitchCommands.TurnOff,
      time: n + delay
    };

    if(addPlanToSwitch(sw, plan)) {
      this.emit(Constants.Event.SwitchStatusChanged, sw);
      runNext.call(this);
    }

  }

  function addPlanToSwitch(sw, plan) {
    let plans = sw.plans;
    let pPrevious = null, pNext = null;

    let i = 0;
    for( ; i < plans.length; i++) {
      let p = plans[i];

      // No pPrevious if this is the first
      pPrevious = (i === 0) ? null : plans[i-1];
      // No pNext if this is the last
      pNext = (i === plans.length) ? null : p;

      if(p.time >= plan.time) {
        logger.error(`    - s . . . plan>time[${plan.time}] - p>time[${p.time}] === i[${i}]`);
        break;
      }
    }

    // logger.info(`- Previous: ${JSON.stringify(pPrevious)}`);
    let OneMin = 60*1000;
    if(pPrevious && (plan.time - pPrevious.time) < OneMin) {
      // Too close to previous plan.
      logger.warn('[switch-mng] Cannot schedule a plan, requested plan is too close to previous one.');
      return false;
    }

    //logger.info(`- PNext: ${JSON.stringify(pNext)}`);
    pNext = (i === plans.length-1) ? null : plans[i];
    if(pNext && (pNext.time - plan.time) < OneMin) {
      // Too close to next plan.
      logger.warn('[switch-mng] Cannot schedule a plan, requested plan is too close to next one.');
      return false;
    }

    if(i === plans.length) {
      plans.push(plan);
    } else {
      plans.splice(i, 0, plan);
    }

    return true;
  }

  function removeSchedule(switchId, planId) {
    let hasRemoved = false;

    let sw = findSwitch.call(this, switchId);
    if(!sw) {
      logger.info('[switch-mng] Switch not found!');
      return hasRemoved;
    }

    let plans = sw.plans;
    if(!plans || plans.length === 0) {
      logger.warn(`[switch-mng] Try removing non-exist plan: Switch [${switchId}].${planId}`);
      return hasRemoved;
    }

    let i = 0, nbPlans = plans.length;
    for(; i < nbPlans; i++) {
      if(plans[i].id === planId) {
        break;
      }
    }

    if(i < nbPlans) {
      let removedPlaned = plans.splice(i, 1);
      removedPlaned = removedPlaned[0];
      hasRemoved = true;
      logger.info(`[switch-mng] Removed a plan: ${JSON.stringify(removedPlaned)}`);

      this.emit(Constants.Event.SwitchStatusChanged, sw);
    } else {
      logger.warn(`[switch-mng] Try removing non-exist plan (*): Switch [${switchId}].${planId}`);
    }

    return hasRemoved;
  }

  function scheduleSwitch1(switchId, status, delay) {

    let s = findSwitch.call(this, switchId);
    if(!s) {
      logger.warn(`[switch-mng] setSwitchStatus Switch Not Found [${switchId}]`);
      return false;
    }

    s.scheduleTask(status, delay);
  }

  function runNext() {

    if(this.scheduleTask) {
      clearTimeout(this.scheduleTask);
    }

    let plan = findNextPlan.call(this);
    if(!plan) {
      logger.info('[switch-mng] task scheduling is stopped. No remaining task.');
      return;
    }

    logger.debug(`[switch-mng] next plan to be executed: ${plan.id}`);

    let n = new Date().getTime(),
      delay = plan.time - n;

    if(delay < 0) {
      this.removeSchedule(plan.switchId, plan.id);
      return runNext.call(this);
    }

    this.scheduleTask = setTimeout(executePlan.bind(this, plan), delay);
  }

  function executePlan(plan) {

    let status = null;

    if(plan.command === SwitchCommands.TurnOn) {
      status = SwitchStatus.On;
    } else if(plan.command === SwitchCommands.TurnOff) {
      status = SwitchStatus.Off;
    } else {
      logger.warn(`[switch-mng] Cannot execute a plan. The command (${plan.command}) is invalid`);
    }

    if(status !== null) {
      this.setSwitchStatus(plan.switchId, status);
    }

    // Call cancel to remove from the list.
    this.removeSchedule(plan.switchId, plan.id);

    runNext.call(this);
  }

  function findNextPlan() {
    let plan = null;

    for(let i = 0; i < this.switches.length; i++) {

      let plans = this.switches[i].plans;
      if(!plans) {
        continue;
      }

      for(let i = 0; i < plans.length; i++) {
        if(plan === null || plans[i].time < plan.time) {
          plan = plans[i];
        }
      }
    }

    return plan;

  }

  function setSwitchStatus(switchId, status) {

    let s = findSwitch.call(this, switchId);
    if(!s) {
      logger.warn(`[switch-mng] setSwitchStatus> Switch Not Found [${switchId}]`);
      return false;
    }

    let Status = Switch.constant.Status;
    if(status === Status.On) {
      s.turnOn();
    } else if(status === Status.Off) {
      s.turnOff();
    } else { // Invalid status
      logger.warn(`[switch-mng] Fail to set switch status. Invalid status (${status})`);
      return false;
    }

    reloadAllSwitchStatus.call(this);

    return true;

  }

  function changeSwitchAutoToggle(switchId, isActive, onDelay, offDelay) {
    let s = findSwitch.call(this, switchId);
    if(!s) {
      logger.warn(`[switch-mng] changeSwitchAutoToggle> Switch Not Found [${switchId}]`);
      return false;
    }

    s.setAutoToggleMode(isActive, onDelay, offDelay);
  }

  function findSwitch(switchId) {
    let found = null;
    let switches = this.switches;

    for(let i = 0; i < switches.length; i++) {
      let s = switches[i];
      if(s.id === switchId) {
        found = s;
        break;
      }
    }

    return found;
  }

  module.exports = new SwitchManagement();

})();
