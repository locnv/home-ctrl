(function() {
  "use strict";

  const SocketIO = require('./socket/app.socketio');

  const ledManagement = require('./led').LedManagement;
  const LedCommands = require('./led').Led.constant.Commands;

  const switchManagement = require('./switch').SwitchManagement;
  const SwitchCommands = require('./switch/switch').constant.Commands;

  const AppConst = require('./app.constant');
  const logger = require('./util/logger');
  const util = require('./util/util');

  const WebSerer = require('./app-web');

  const DeviceTypes = AppConst.DeviceType;

  let socketIo;
    // switchManagement = new SwitchManagement();
    // ledManagement = new LedManagement();

  setTimeout(runApp, 1);

  function runApp() {

    socketIo = new SocketIO();
    let Event = socketIo.constants.Event;

    socketIo.on(Event.SocketInit, onSocketIoReady);

    // Listen for Remote events
    socketIo.on(Event.RemoteMessage, dispatchRemoteMessage);
    socketIo.initialize();

    let SwitchEvent = switchManagement.constants.Event;
    switchManagement.on(SwitchEvent.SwitchStatusChanged, onSwitchStatusChanged);

    let LedEvent = ledManagement.constants.Event;
    ledManagement.on(LedEvent.LedStatusChanged, onLedStatusChanged);

    new WebSerer();

  }

  function onSwitchStatusChanged(sw) {
    sendDevicesStatusReport([sw], []);
  }

  function onLedStatusChanged(led) {
    sendDevicesStatusReport([], [led]);
  }

  function onSocketIoReady(ctx) {
    logger.debug('[app] Socket Initialized > ', ctx);
    let allSwitches = switchManagement.getAllSwitches();
    let allLeds = ledManagement.getAllLeds();
    sendDevicesStatusReport(allSwitches, allLeds);
  }

  function sendDevicesStatusReport(switches, leds) {
    let switchesInfo = [];
    for(let i = 0; i < switches.length; i++) {
      let sw = switches[i];
      let swInfo = toSwitchInfo(sw);

      switchesInfo.push(swInfo);
    }

    let ledsInfo = [];
    for(let i = 0; i < leds.length; i++) {
      let led = leds[i];
      let ledInfo = toLedInfo(led);

      ledsInfo.push(ledInfo);
    }

    let MessageTypes = socketIo.constants.MessageTypes;

    let message = {
      id: util.generateUuid(),
      messageType: MessageTypes.StatusReport,
      sender: AppConst.App.Identifier,
      target: '*',
      data: {
        switches: switchesInfo,
        leds: ledsInfo,
        time: new Date()
      }
    };

    socketIo.sendMessage(message);

  }

  function toSwitchInfo(sw) {
    return {
      name: sw.name,
      id: sw.id,
      devType: DeviceTypes.Switch,
      status: sw.status,
      plans: sw.plans
    }
  }

  function toLedInfo(led) {
    return {
      name: led.name,
      id: led.id,
      devType: DeviceTypes.Led,
      mode: led.mode,
      blinkInterval: led.blinkCfg.interval,
      chaseInterval: led.chaseCfg.interval,
      dimInterval: led.dimCfg.interval,
      r: led.r,
      g: led.g,
      b: led.b
    }
  }

  /**
   * Dispatch remote message:
   * - switch command
   * - LEDs command
   * - ...
   * @param message
   */
  function dispatchRemoteMessage(message) {

    //logger.debug('[app] dispatching message', message);
    let messageType = message.messageType;
    let msgData = message.data;

    let MessageTypes = socketIo.constants.MessageTypes;

    switch(messageType) {

      case MessageTypes.DirectCommand:
        let cmd = msgData.command;
        if(isSwitchCommand(cmd)) {
          switchManagement.handleRemoteMessage(msgData);
        } else if(isLedCommand(cmd)) {
          ledManagement.handleRemoteMessage(msgData);
        } else {
          logger.warn(`[app] receive a direct-command with invalid command: ${cmd}`);
        }

        break;

      case MessageTypes.StatusReportReq:
        let allSwitches = switchManagement.getAllSwitches();
        let allLeds = ledManagement.getAllLeds();
        sendDevicesStatusReport(allSwitches, allLeds);
        break;

      default:
        logger.info('[app] un-handled message', msgData);
        break;

    }

  }

  function isSwitchCommand(cmd) {

    return (
      cmd === SwitchCommands.TurnOn ||
      cmd === SwitchCommands.TurnOff ||
      cmd === SwitchCommands.Schedule ||
      cmd === SwitchCommands.RmSchedule);
  }

  function isLedCommand(cmd) {

    return (
      cmd === LedCommands.SetColor ||
      cmd === LedCommands.SetMode);
  }

})();
