/* global angular */
/* global console */
/* global _global */
/* global cordova */
/* global Promise */
(function() {
  'use strict';

  angular
    .module(_global.AppName)
    .factory('LogService', LogService);

  LogService.$inject = [];
  function LogService() {

    /* Constants */
    let EnableLogFile = false;
    let FileName = 'learn-voca';
    let LogLevel = {
      Error: 0,
      Warn: 1,
      Info: 2,
      Debug: 3,
    };

    /* Local variables */
    let fileLog  = null;
    let logQueue = [];
    let writing  = false;
    let mIsLogFileCreated = false;
    let mLogLevel = LogLevel.Debug;

    /* [Runtime] Hold limitation number of logs */
    let MaxCriticalLog = 200;
    let mCriticalLogs = [];

    /* Service's interface */
    let services = {
      initialize: initialize,
      getCriticalLogs: getCriticalLogs,
      debug: debug,
      info: info,
      warn: warn,
      error: error,
    };

    return services;

    // Implementation

    function initialize() {
      if(!EnableLogFile || mIsLogFileCreated) {
        return Promise.resolve(true);
      }

      let promise = new Promise(function(resolve, reject) {
        createLogFile();
        scheduleQueue();
        mIsLogFileCreated = true;

        setTimeout(resolve.bind(null, true), 500);
      });

      return promise;
    }

    /**
     * Retrieve list of critical logs.
     *
     * @returns {Array}
     */
    function getCriticalLogs() {
      return mCriticalLogs;
    }

    /**
     *
     * @private
     */
    function scheduleQueue(){
      if(!writing) {
        setInterval(writeLogs, 1000);
      }
    }

    /**
     * create log file
     */
    function createLogFile(){
      let path = getDefaultFilePath();
      let currentDate = new Date();
      let datetime =  '' + currentDate.getFullYear() +
        ('0'+(currentDate.getMonth()+1)).slice(-2) +  currentDate.getDate();

      let validated = (cordova && cordova.file !== null && path !== null);
      if(!validated) {
        return;
      }

      window.resolveLocalFileSystemURL(path, function (dir) {
        dir.getFile(FileName + datetime + '.log', { create: true }, function (file) {
          fileLog = file;
        });
      });
    }

    /**
     * get default file path
     * @returns {*}
     * @private
     */
    function getDefaultFilePath () {
      if(cordova && cordova.file && cordova.file.dataDirectory) {
        return cordova.file.dataDirectory;
      } else {
        return null;
      }
    }

    /**
     * get Log text with date time
     * @param msg
     * @returns {string}
     * @private
     */
    function getLogText(msg){
      let date = new Date();
      let result =  date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' +
        date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds() +
        ' : ' + msg + '\n';
      return result;
    }

    /**
     * write an entry to log file
     * @param entry
     * @param onWriteComplete
     * @private
     */
    function writeEntry(entry, onWriteComplete) {
      // Call to IO functions
      fileLog.createWriter(function(fileWriter) {
        fileWriter.onwriteend = function() {
          onWriteComplete();
        };

        fileWriter.seek(fileWriter.length);
        let blob = new Blob(["\ufeff", entry]);
        fileWriter.write(blob);
      }, function () {
        console.log('error createwriter');
      });
    }

    /**
     * write a logs to current file
     * @private
     */
    function writeLogs(){
      if(!fileLog || logQueue.length <= 0) {
        writing = false;
        return;
      }
      writing = true;
      let logText = logQueue.shift();
      writeEntry(logText, function () {
        writeLogs();
      });
    }

    /**
     * write a info log
     * @param message
     */
    function info() {
      if(mLogLevel < LogLevel.Info) {
        return;
      }

      let message = concateArgs('[info]', arguments);
      console.info(message);
      queueLog(message);

      addCriticalLog(message);
    }

    /**
     * write a warn log
     * @param message
     */
    function warn(){
      let message = concateArgs('[warn]', arguments);
      console.warn(message);
      queueLog(message);

      addCriticalLog(message);
    }

    /**
     * write an debug log
     * @param message
     */
    function error() {
      let message = concateArgs('[error]', arguments);
      console.error(message);
      queueLog(message);

      addCriticalLog(message);
    }

    function addCriticalLog(message) {
      mCriticalLogs.push(message);
      if(mCriticalLogs.length > MaxCriticalLog) {
        let nbToRemove = 20;
        mCriticalLogs.splice(0, nbToRemove);
        //mCriticalLogs.splice(10);
      }
    }

    /**
     * write a debug log
     * @param message
     */
    function debug() {
      if(mLogLevel < LogLevel.Debug) {
        return;
      }

      let message = concateArgs('[debug]', arguments);
      console.debug(message);
      queueLog(message);
    }

    function concateArgs(levelInfor, args) {
      if(!args || args.length === 0) {
        return '';
      }

      let first = true;
      let message = getTimeFormatted() + levelInfor + ': ';
      for(let i = 0; i < args.length; i++) {
        let arg = args[i];
        let tmp = (typeof arg === 'string') ? arg : JSON.stringify(arg);
        message +=  ((!first ? '> ' : '') + tmp);

        first = false;
      }

      return message;
    }

    function getTimeFormatted() {
      let d = new Date();
      let t = '['+ d.getHours() +':'+
        ('0' + d.getMinutes()).slice(-2) +':'+
        ('0' + d.getSeconds()).slice(-2) +' '+
        ('00' + d.getMilliseconds()).slice(-3) +']';

      return t;
    }

    function queueLog(msg) {
      if(!EnableLogFile) {
        return;
      }

      let text = getLogText(msg);
      logQueue.push(text);
    }
  }
})();

