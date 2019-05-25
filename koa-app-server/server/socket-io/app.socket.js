/**
 * Created by locnv on 11/3/18.
 */

(function() {
  "use strict";

  const EventEmitter = require('events').EventEmitter;
  const nodeUtil = require('util');
  const IO = require('koa-socket.io');
  const debug = require('debug')('socket-io');
  const logger = require('../util/logger');
  const appUtil = require('../util/util');

  const Events = {
    // Remote message event name
    // To raise in-coming message to upper layer for dispatching
    RemoteMessage: 'rm-message'
  };

  /**
   *
   * @type {
   * {
   *  StatusReport: string,
   *  StatusReportReq: string,
   *  DirectCommand: string,
   *  Ack: string,
   *  None: string
   * }}
   */
  const MessageTypes = {
    StatusReport: 'status-report',
    StatusReportReq: 'status-report-req',
    DirectCommand: 'direct-command',
    Ack: 'ack',
    None: 'server-message'
  };

  const io = new IO({
    namespace: '/'
  });

  let mSockets = {};

  function SocketIO() {
    this.name = 'Eugene';
  }

  nodeUtil.inherits(SocketIO, EventEmitter);

  SocketIO.prototype.Constants = {
    Events: Events,
    MessageTypes: MessageTypes
  };

  SocketIO.prototype.initialize = initialize;

  function initialize(server) {
    this.server = server;

    /*io.on('global-nsp', function* () {

      logger.debug('[socket-io] join event received, new user: ', this.data);

      // use global io send boradcast
      io.emit('message', '[All]: ' + this.data + ' joined');

      // use current socket send a broadcast
      this.socket.broadcast('message', '[All]: Hello guys, I\'m ' + this.data + '.');

      // just send to current user
      this.socket.emit('message', '[' + this.data + ']' + " Welcome to koa-socket.io !");
    });*/

    let options = {/* socket.io options */};
    io.start(server, options/*, port, host */);

    // middleware
    //io.use(async (ctx, next) => {
    //  logger.debug('middleware invoke begin: %s, %s', ctx.event, ctx.id);
    //  await next();
    //  logger.debug('middleware invoke end: %s, %s', ctx.event, ctx.id);
    //});
    // [auth] Another Middleware TODO
    // https://stackoverflow.com/questions/36788831/authenticating-socket-io-connections
    io.use(function(socket, next){

      /*if (socket.handshake.query && socket.handshake.query.token){
        jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
         if(err) return next(new Error('Authentication error'));
         socket.decoded = decoded;
         next();
         });
      } else {
        next(new Error('Authentication error'));
      }*/

      return next();
    });

    // common function event handler
    io.on('connect', onClientConnected.bind(this));

  }

  async function onClientConnected(ctx, next) {

    let socketId = ctx.id;
    let socket = ctx.socket;
    mSockets[socketId] = socket;
    socket.connectedAt = new Date();

    logger.info('[socket-io] New user connected: ' + ctx.id);

    // Send a welcome message to every newly connected client
    //socket.emit('message', {
    //  id: appUtil.generateUuid(),
    //  messageType: MessageTypes.None,
    //  data: {
    //    socketId: socket.id,
    //    serverTime: new Date()
    //  }
    //});

    socket.on('message', onClientMessage.bind(this));

    // when the user disconnects.. perform this
    socket.on('disconnect', onClientDisconnected.bind(this));
  }

  async function onClientDisconnected(ctx) {
    let socketId = ctx.id;
    let socket = mSockets[socketId];
    if(socket) {
      logger.info('[socket-io] Disconnected: ' + socketId);
      //socket.off('message', onClientMessage.bind(this));

      delete mSockets[socketId];
    }
  }

  async function onClientMessage(ctx) {
    let socket = findSocketById(ctx.id);
    if(!socket) { // Something wrong.
      return;
    }

    if(!socket.identifier) {
      let msgData = ctx.data;
      if(msgData && msgData.data && msgData.data.identifier) {
        let id = msgData.data.identifier;
        socket.identifier = id;

        logger.debug(`[socket-io] client identified. Socket[${ctx.id}](${id})`);
      } else {
        logger.warn(`[socket-io] Receive message from un-identified client Socket[${ctx.id}]. Message shall be ignored`);
        return;
      }
    }

    handleMessages.call(this, socket, ctx.data);
  }

  function handleMessages(socket, message) {
    if(!message || !message.id) {
      logger.warn('[socket-io] Received invalid message', message);
      return;
    }

    // Send ACK
    //sendAckMessage.call(this,socket, message);

    // Raise RemoteMessage to upper layer for dispatching.
    this.emit(Events.RemoteMessage, message);

  }

  function sendAckMessage(socket, message) {
    let ackMessage = {
      id: appUtil.generateUuid(),
      sender: 'server',
      messageType: MessageTypes.Ack,
      data: {
        messageId: message.id,
        receivedTime: new Date(),
      }
    };

    //logger.debug('[socket-io] sending ack message.', ackMessage);
    this.sendMessage(socket.identifier, 'message', ackMessage);

  }

  /**
   * Send direct message
   *
   * @param target {string} identifier
   * @param message {object} free formatting message object
   */
  SocketIO.prototype.sendMessage = function(target, event, message) {
    let socket = findSocketByIdentifier(target);
    if(socket === null) {
      logger.error(`[socket-io] Cannot send message. Socket [${target}] Not found`);
      return;
    }

    //logger.debug(`[socket-io] Send message. Target[${target}]; Event[${event}]`);
    logger.debug(`[socket-io] Sending a message.`, message);

    socket.emit(event, message);

  };

  function findSocketById(socketId) {
    /*let socket = null;

    for(let id in mSockets) {

      if(id === socketId) {
        socket = mSockets[id];
        break;
      }
    }

    return socket;*/

    return mSockets[socketId];

  }

  function findSocketByIdentifier(identifier) {
    let socket = null;

    for(let id in mSockets) {
      let s = mSockets[id];
      if(s && s.identifier === identifier) {
        socket = s;
        break;
      }
    }

    return socket;
  }

  /**
   * Broadcast a message to a room
   * @param room
   * @param message
   */
  SocketIO.prototype.broadcastMessage = function(topic, message) {
    logger.debug('[socket-io] broadcast message.', {
      topic: topic,
      message: message
    });

    io.emit(topic, message);

  };

  module.exports = new SocketIO();

})();
