/**
 * Created by locnv on 12/1/18.
 */

/* global angular */
/* global _global */
(function() {
  'use strict';

  angular.module(_global.AppName)
  .factory('DevComm', ServiceImpl);

  /* Dependencies injection */
  ServiceImpl.$inject = [ 'SocketIO', 'LogService', 'AppConstants','Util' ];

  /* Service implementation */
  function ServiceImpl( socketIo, logger, appConst, util ) {

    var SwitchCommand = appConst.SwitchCommands;
    var SwitchStatus = appConst.SwitchStatus;

    var LedCommands = appConst.LedCommands;
    var LedModes = appConst.LedModes;

    var DeviceType = appConst.DeviceType;

    // Static data, may not use later
    var SelectedGW = appConst.GW;
    var mDevices = {};

    var LedInfoKeys = [
      'name', 'devType', 'mode', 'blinkInterval', 'chaseInterval', 'dimInterval', 'r', 'g', 'b' ];

    var SWInfoKeys = [ 'name', 'devType', 'status', 'plans' ];

    mDevices.switches = [
      {
        id: 'switch-lamp',
        devType: DeviceType.Switch,
        display: 'Light',
        target: SelectedGW,
        status: SwitchStatus.Unknown,
        imageUrl: {
          Unknown: './img/light-off.png',
          On: './img/light-on.png',
          Off: './img/light-off.png',
        },
        plans: [],
        isProcessing: false,
      }, {
        id: 'switch-fan',
        devType: DeviceType.Switch,
        display: 'Fan',
        target: SelectedGW,
        status: SwitchStatus.Unknown,
        imageUrl: {
          Unknown: './img/fan-off.png',
          On: './img/fan-on.png',
          Off: './img/fan-off.png',
        },
        plans: [],
        isProcessing: false
      }
    ];

    mDevices.leds = [
      {
        id: 'led-1',
        name: 'LED 1',
        devType: DeviceType.Led,
        mode: LedModes.None,
        target: appConst.GW,
        r: 0, g: 0, b: 0
      }, {
        id: 'led-2',
        name: 'LED 2',
        devType: DeviceType.Led,
        mode: LedModes.None,
        target: appConst.GW,
        r: 0, g: 0, b: 0
      }
    ];

    // End of Static data definition

    var Identifier = appConst.Identifier;
    var EventName = 'message';
    var MessageTypes = socketIo.MessageTypes;

    var mDevStatusChangedListener = [];

    socketIo.addMessageReceiveListener(onMessageReceived);

    /* Interface declaration */
    var inst = {

      getAllPreDefinedSwitches: getAllPreDefinedSwitches,
      getAllPreDefinedLEDs: getAllPreDefinedLEDs,

      addDevChangedListener: addDevChangedListener,
      removeDevChangedListener: removeDevChangedListener,

      // GW commands
      sendStatusReportReq: sendStatusReportReq,

      // Switch commands
      turnOn: turnOn,
      turnOff: turnOff,
      schedule: schedule,
      removeSchedule: removeSchedule,

      // LED commands
      sendSetLEDColor: sendSetLEDColor,
      sendSetLEDMode: sendSetLEDMode,

    };

    return inst;

    /////////////////////////////////////////////////////////
    //// Implementation
    /////////////////////////////////////////////////////////

    function addDevChangedListener(fn) {
      var idx = mDevStatusChangedListener.indexOf(fn);
      if(idx !== -1) {
        return;
      }

      mDevStatusChangedListener.push(fn);

      logger.debug('[dev-comm] > add status change listener > ' + mDevStatusChangedListener.length);
    }

    function removeDevChangedListener(fn) {
      var idx = mDevStatusChangedListener.indexOf(fn);
      if(idx === -1) {
        return;
      }

      mDevStatusChangedListener.splice(idx, 1);

      logger.debug('[dev-comm] > remove status change listener > ' + mDevStatusChangedListener.length);
    }

    function getAllPreDefinedSwitches() {
      return mDevices.switches;
    }

    function getAllPreDefinedLEDs() {
      return mDevices.leds;
    }

    /**
     * Handle remote message
     * @param message
     */
    function onMessageReceived(message) {

      var messageType = message.messageType;
      var msgData = message.data;

      switch(messageType) {

        case MessageTypes.StatusReport:

          var devices = [];
          if(Array.isArray(msgData.switches)) {
            devices = devices.concat(msgData.switches);
          }

          if(Array.isArray(msgData.leds)) {
            devices = devices.concat(msgData.leds);
          }

          updateDeviceInfo(devices);
          notifySwitchStatusChanged(devices);

          break;

        default:
          logger.debug('[dev-comm] new un-handled message ', message);
          break;
      }

    }

    function notifySwitchStatusChanged(switches) {
      mDevStatusChangedListener.forEach(function(fn) {
        fn.call(null, switches);
      });
    }

    function updateDeviceInfo(devices) {
      for(var i = 0; i < devices.length; i++) {
        var dev = devices[i];

        if(dev.devType === DeviceType.Led) {
          updateLed(dev);
        } else if(dev.devType === DeviceType.Switch) {
          updateSwitch(dev);
        }
      }
    }

    function updateLed(ledInfo) {
      var led = findDevice(ledInfo.id, DeviceType.Led);

      if(!led) {
        logger.warn('[dev-comm] un-managed device: '+JSON.stringify(ledInfo));
        return;
      }

      util.copy(led, ledInfo, LedInfoKeys);

    }

    function updateSwitch(swInfo) {
      var sw = findDevice(swInfo.id, DeviceType.Switch);

      if(!sw) {
        logger.warn('[dev-comm] un-managed device: '+JSON.stringify(sw));
        return;
      }

      util.copy(sw, swInfo, SWInfoKeys);

    }

    function findDevice(devId, devType) {
      var allDevices = [];
      if(devType === DeviceType.Led) {
        allDevices = mDevices.leds;
      } else if(devType === DeviceType.Switch) {
        allDevices = mDevices.switches;
      }

      var found = null;

      for(var i = 0; i < allDevices.length; i++) {
        var dev = allDevices[i];
        if(dev.id === devId) {
          found = dev;
          break;
        }
      }

      return found;

    }

    /////////////////////////////////////////////////////////
    //// C O M M A N D S
    /////////////////////////////////////////////////////////

    /**
     * Send Switch command: turn-on
     * @param target
     * @param devId
     */
    function turnOn(target, devId) {
      var message = {
        sender: Identifier,
        target: target,
        messageType: MessageTypes.DirectCommand,
        data: {
          command: SwitchCommand.TurnOn,
          switchId: devId
        }
      };

      socketIo.sendMessage(EventName, message);

    }

    /**
     * Send Switch command: turn-off
     * @param target
     * @param devId
     */
    function turnOff(target, devId) {

      var message = {
        sender: Identifier,
        target: target,
        messageType: MessageTypes.DirectCommand,
        data: {
          command: SwitchCommand.TurnOff,
          switchId: devId
        }
      };

      socketIo.sendMessage(EventName, message);
    }

    /**
     * Send Switch command: schedule
     * @param target
     * @param devId
     * @param cmd
     * @param delay
     */
    function schedule(target, devId, cmd, delay) {

      var message = {
        sender: Identifier,
        target: target,
        messageType: MessageTypes.DirectCommand,
        data: {
          switchId: devId,
          command: SwitchCommand.Schedule,
          subCommand: cmd,
          delay: delay
        }
      };

      socketIo.sendMessage(EventName, message);
    }

    /**
     * * Send Switch command: remove-schedule
     * @param target
     * @param devId
     * @param planId
     */
    function removeSchedule(target, devId, planId) {

      var message = {
        sender: Identifier,
        target: target,
        messageType: MessageTypes.DirectCommand,
        data: {
          planId: planId,
          switchId: devId,
          command: SwitchCommand.RmSchedule
        }
      };

      socketIo.sendMessage(EventName, message);
    }

    /**
     * Send status-report-req request
     * @param target
     */
    function sendStatusReportReq(target) {

      var message = {
        sender: Identifier,
        target: target,
        messageType: MessageTypes.StatusReportReq,
        data: {}
      };

      socketIo.sendMessage(EventName, message);

    }

    /**
     * Send LED command: set-color
     * @param target
     * @param ledId
     * @param r
     * @param g
     * @param b
     */
    function sendSetLEDColor(target, ledId, r, g, b) {

      var message = {
        sender: Identifier,
        target: target,
        messageType: MessageTypes.DirectCommand,
        data: {
          command: LedCommands.SetColor,
          ledId: ledId,
          r: r,
          g: g,
          b: b
        }
      };

      logger.debug('SetLED color message: ' +JSON.stringify(message));

      socketIo.sendMessage(EventName, message);

    }

    /**
     * Send LED command: set-mode
     * @param target
     * @param ledId
     * @param mode
     * @param extParams
     */
    function sendSetLEDMode(target, ledId, mode, extParams) {

      var message = {
        sender: Identifier,
        target: target,
        messageType: MessageTypes.DirectCommand,
        data: {
          command: LedCommands.SetMode,
          ledId: ledId,
          mode: mode
        }
      };

      if(extParams) {
        for(var key in extParams) {
          var v = extParams[key];
          message.data[key] = v;
        }
      }

      logger.debug('SetLED mode message: ' +JSON.stringify(message));

      socketIo.sendMessage(EventName, message);

    }

  }

})();
