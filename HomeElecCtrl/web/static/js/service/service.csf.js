/*jshint esversion: 6 */
/* global angular */
/* global _global */
(function() {
  'use strict';

  angular.module(_global.AppName)
  .factory('AppCsf', ServiceImpl);

  ServiceImpl.$inject = [
    'AppNavigator', 'AppConstants', 'LogService', 'Util', 'Notifier', 'FileStorage',
    'RtStorage', 'I18N', 'HttpComm', 'SocketIO', 'Speech' ];

  function ServiceImpl(
    mAppNavigator, mConst, mLogger, appUtil, notifier, fileStorage, rtStorage,
    I18N, dic, HttpComm, socketIo, speech) {

    let inst = {
      appConst: mConst,
      logger: mLogger,
      navigator: mAppNavigator,
      util: appUtil,
      notifier: notifier,
      fileStorage: fileStorage,
      rtStorage: rtStorage,
      i18n: I18N,
      dic: dic,
      http: HttpComm,
      socketIo: socketIo,
      speech: speech,

    };

    return inst;

  }
})();
