/**
 * Created by locnv on 11/29/18.
 */

/*jshint esversion: 6 */
/* global angular */
/* global _global */
/* global io */
(function() {
  'use strict';

  angular.module(_global.AppName)
  .factory('SocketIO', ServiceImpl);

  ServiceImpl.$inject = [ 'LogService', 'Util', 'AppConstants' ];

  function ServiceImpl( logger, util, appConst ) {

    let Host = util.Remote.Host;
    let mInitialized = false;
    let mSocket = null;
    let Identifier = appConst.Identifier;
    let SelectedGW = appConst.GW;

    let mMsgRevListeners = [];

    const MessageTypes = {
      StatusReport: 'status-report',
      StatusReportReq: 'status-report-req',
      DirectCommand: 'direct-command',
      Ack: 'ack',
      None: 'server-message'
    };

    let inst = {
      MessageTypes: MessageTypes,
      initialize: initialize,
      isInitialized: isInitialized,
      addMessageReceiveListener: addMessageReceiveListener,
      sendMessage: sendMessage,
    };

    return inst;

    /**
     * Initialization
     *
     * @return {Promise}
     */
    function initialize() {
      let promise = new Promise(function(resolve, reject) {
        internal_initialize(resolve, reject);
      });

      function internal_initialize(_resolve) {
        if(mInitialized) {
          setTimeout(_resolve, 1);
          return;
        }

        mSocket = io(Host);

        mSocket.on('connect', function(socket) {
          logger.debug('[socket-io] Connected to server @' +Host);
          sendIdentifyMessage();
        });

        let GwStatusEvent = SelectedGW + '-status-report';
        mSocket.on(GwStatusEvent, function(m) {
          //logger.debug('[socket-io] Device status change received', m);
          notifyMessageReceive(m);
        });

        mSocket.on('message', function(data) {
          //logger.debug('[socket-io] Receive new message.', data);
          notifyMessageReceive(data);
        });

        //let target = Identifier;
        //mSocket.on(target+'-status', function(data) {
        //  logger.debug('[socket-io] Receive status message.', data);
        //});

        mSocket.on('global-message', function(data) {
          logger.debug('[socket-io] [global-message] ', data);
        });

        mSocket.on('disconnect', function() {
          logger.debug('socket-io > disconnected');
        });

        mInitialized = true;

        setTimeout(_resolve, 1);

      }

      return promise;
    }

    function addMessageReceiveListener(fn) {
      let idx = mMsgRevListeners.indexOf(fn);

      if(idx !== -1) {
        return;
      }

      mMsgRevListeners.push(fn);
    }

    function notifyMessageReceive(message) {
      for(let i = 0; i < mMsgRevListeners.length; i++) {
        let fn = mMsgRevListeners[i];
        fn.call(null, message);
      }
    }

    function sendIdentifyMessage() {

      let message = {
        messageType: MessageTypes.None,
        sender: Identifier,
        data: {
          identifier: (Identifier),
          time: new Date()
        }
      };

      sendMessage('message', message);

    }

    /**
     * Send a message through the socket io
     * @param event
     * @param message
     */
    function sendMessage(event, message) {
      if(!mInitialized) {
        logger.warn('[socket-io] SocketIO is not initialized yet. Message cannot be sent.');
        return null;
      }

      if(typeof message !== 'object') {
        logger.error('[socket-io] Message must be instanced of an object');
        return null;
      }

      if(!message.id) {
        message.id = getUuid();
      }

      logger.debug('[socket-io] sending message.', message);

      mSocket.emit(event, message);

      return message;
    }

    function getUuid() {
      return util.guid();
    }

    function isInitialized() {
      return mInitialized;
    }

  }
})();
