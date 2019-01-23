/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";


  let socketIo = require('../socket-io');
  let logger = require('../util/logger');

  const Commands = {
    TurnOn: 'turn-on',
    TurnOff: 'turn-off',
    Schedule: 'schedule',
    AutoToggle: 'auto-toggle'
  };

  let SwitchOnOffMsg = [ 'switchId', 'command' ];
  let SwitchSchedule = [ 'switchId', 'command', 'subCommand', 'delay' ];
  let SwitchAutoToggle = [ 'switchId', 'command', 'isActive', 'onDelay', 'offDelay' ];

  function AppController() { }

  /**
   * Switch commands:
   * 1. turn-on
   *
   * 2. turn-off
   *
   * 3. schedule
   *
   * 4. auto-toggle
   *
   *
   * @param ctx
   * @param next
   * @return {Promise.<void>}
   */
  AppController.prototype.command = async function (ctx, next) {

    let request = ctx.request;
    let reqData = request.body.data;

    logger.debug('Elec Control Request:');
    logger.debug(request.body);

    // Just to demo a TurnOn command
    // let target = 'home-npc-2018';
    // let switchId = 'switch-bed';
    // let command = 'turn-on';
    let target = reqData.target;
    //let switchId = reqData.switchId;
    let command = reqData.command;

    let msgData = extractMessageBody(command, reqData);

    socketIo.sendMessage(target, {
      id: 'switch-command',
      data: msgData,
      serverTime: new Date()
    });

    setTimeout(function() {
      socketIo.broadcastMessage(`${target}-status`, {
        data: msgData,
        serverTime: new Date()
      });
    }, 1000);

    ctx.body = reqData;
  };

  function extractMessageBody(command, reqData) {
    let message = {};

    let keys = getMessageTemplates(command);

    for(let i = 0; i < keys.length; i++) {
      let k = keys[i];
      let d = reqData[k];
      if(!d) {
        logger.warn('ctrl-elec > wrong request data. command: ' + command +'; reqData: ' +JSON.stringify(reqData));
        return null;
      }

      message[k] = d;
    }

    return message;
  }

  function getMessageTemplates(command) {
    let keys = [];

    switch(command) {
      case Commands.TurnOn:
      case Commands.TurnOff:
        keys = SwitchOnOffMsg;
        break;
      case Commands.Schedule:
        keys = SwitchSchedule;
        break;
      case Commands.AutoToggle:
        keys = SwitchAutoToggle;
        break;
      default:
        break;
    }

    return keys;
  }


  module.exports = new AppController();

})();
