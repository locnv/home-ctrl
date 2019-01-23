/**
 * Created by locnv on 11/4/18.
 */

(function() {
  "use strict";

  const SocketIoClient = require('socket.io-client');
  const EventEmitter = require('events').EventEmitter;
  const util = require('util');
  const logger = require('../util/logger');

  const mConst = require('../app.constant');

  const Host = mConst.Remote.Host;
  const Identifier = mConst.App.Identifier;
  const JWT = mConst.App.AccessToken;

  const MessageTypes = {
    StatusReport: 'status-report',
    StatusReportReq: 'status-report-req',
    DirectCommand: 'direct-command',
    Ack: 'ack',
    None: 'server-message'
  };

  const Constants = {
    Event: {
      SocketInit: 'socket-init',
      RemoteMessage: 'rm-message'
    },

    MessageTypes: MessageTypes
  };

  let DirectCommandEvent = `${mConst.App.Identifier}-direct-command`;
  let StatusReportReqEvent = `${mConst.App.Identifier}-status-report-req`;
  let DisconnectEvent = 'disconnect';

  function SocketClient() {
    this.name = Identifier;
    this.isConnected = false;

    testEventEmitter.call(this);
  }

  util.inherits(SocketClient, EventEmitter);

  SocketClient.prototype.constants = Constants;
  SocketClient.prototype.initialize = initialize;
  SocketClient.prototype.sendMessage = sendMessage;

  function initialize() {

    this.socket = SocketIoClient(Host, {
        autoConnect: false,
        query: { token: JWT }
      }
    );
    this.socket.on('connect', onConnected.bind(this));
    this.socket.open();
  }

  function onConnected() {
    this.isConnected = true;

    this.socket.on(DirectCommandEvent, handleMessage.bind(this));
    this.socket.on(StatusReportReqEvent, handleMessage.bind(this));

    this.socket.on(DisconnectEvent, onDisconnected.bind(this));

    sendIdentifyMessage.call(this);

    logger.info(`[socket-io] connected to server @${Host}`);
  }

  function sendIdentifyMessage() {

    var message = {
      messageType: MessageTypes.None,
      target: 'server',
      sender: Identifier,
      data: {
        identifier: Identifier,
        time: new Date()
      }
    };

    this.sendMessage(message);

  }

  function onDisconnected() {
    this.isConnected = false;

    this.socket.removeAllListeners(DirectCommandEvent);
    this.socket.removeAllListeners(StatusReportReqEvent);
    this.socket.removeAllListeners(DisconnectEvent);

    logger.info('[socket-io] disconnected from server!');
  }

  function handleMessage(message) {
    logger.debug('[socket-io] Receive new message', message);
    // Do emit event to upper layer
    // This layer shall not be in charge of
    // dispatching message
    this.emit(Constants.Event.RemoteMessage, message);
  }

  /**
   *
   * @param message {object}
   */
  function sendMessage(message) {
    if(!this.isConnected) {
      logger.warn('[socket-io] [sendMessage] SocketIO is not connected yet. Cannot send message.');
      return false;
    }

    if(!message || typeof message !== 'object') {
      logger.warn('[socket-io] [sendMessage] message must be in type of object.');
      return false;
    }

    if(!message.identifier) {
      message.identifier = Identifier;
    }

    logger.debug('[socket-io] Sending a message', message);
    this.socket.emit('message', message);

  }

  function testEventEmitter() {

    if(!this.isConnected) {
      setTimeout(testEventEmitter.bind(this), 1000);
      return;
    }

    console.log(`raiseInitEvent > this[${this.name}]`);
    this.emit(Constants.Event.SocketInit, {
      name: 'Eugene'
    });

  }

  module.exports = SocketClient;

})();
