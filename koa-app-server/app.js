
(function() {
  "use strict";

  require('./lib/inheristancable');
  require('./bootstrap');
  const _ = require('lodash');
  const http = require('http');
  const KoaApp = require('./app-koa');
  const socketIo = require('./server/socket-io');
  const logger = require('./server/util/logger');

  const wordBuilderService = require('./server/word-builder/service.word.builder');

  const PORT = 1337;
  const HOST = 'localhost';
  // const HOST = '192.168.0.116';

  setTimeout(start, 1);

  function start() {

    let app = new KoaApp();
    let server = http.createServer(app.callback());
    socketIo.initialize(server);
    socketIo.on(socketIo.Constants.Events.RemoteMessage, dispatchRemoteMessage);

    server.on('error', function (error) {
      logger.error('[app] An error occurs while loading server.', error);
    });

    server.listen(PORT, HOST, function () {
      logger.debug(`[app] server listen on: http://${HOST}:${PORT}`);

      // Demo
      //logger.info('Start word-builder in 2 seconds ...');
      //setTimeout(wordBuilderService.start.bind(null, 'en-en'), 2000);
      //wordBuilderService.importBaseWord();
    });
  }

  function dispatchRemoteMessage(message) {
    logger.debug('[app][message-dispatcher] Receive message', message);

    let target = message.target;
    if(target === undefined || target === null || target === 'server') {
      //logger.debug('[app][message-dispatcher] Message to Server.');
      return;
    }

    let msgType = message.messageType;
    let msgData = message.data;
    let MessageTypes = socketIo.Constants.MessageTypes;

    let event = '';
    switch(msgType) {
      case MessageTypes.DirectCommand:
      case MessageTypes.StatusReportReq:
        event = `${target}-${msgType}`;
        socketIo.sendMessage(target, event, message);
        break;

      case MessageTypes.StatusReport:
        event = `${message.sender}-${msgType}`;
        socketIo.broadcastMessage(event, message);
      break;

      default:
        break;
    }

  }

})();
