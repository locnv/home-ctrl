/*jshint esversion: 6 */
/* global angular */
/* global _global */
(function() {
  'use strict';

  angular.module(_global.AppName)
    .factory('AppCsf', ServiceImpl);

  ServiceImpl.$inject = [
    'AppNavigator', 'AppConstants', 'LogService', 'Util', 'Config', 'Notifier', 'FileStorage',
    'RtStorage', 'TaskExecutor', 'I18N', 'DIC', 'HttpComm', 'SocketIO' ];

  function ServiceImpl(
    mAppNavigator, mConst, mLogger, appUtil, appConfig, notifier, fileStorage, rtStorage, taskExecutor,
    I18N, dic, HttpComm, socketIo) {

    let inst = {
      appConst: mConst,
      logger: mLogger,
      navigator: mAppNavigator,
      util: appUtil,
      config: appConfig,
      notifier: notifier,
      fileStorage: fileStorage,
      rtStorage: rtStorage,
      taskExecutor: taskExecutor,
      i18n: I18N,
      dic: dic,
      http: HttpComm,
      socketIo: socketIo
    };

    return inst;

  }
})();