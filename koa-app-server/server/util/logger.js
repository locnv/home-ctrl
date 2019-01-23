/**
 * Created by locnv on 11/27/18.
 */

(function() {
  "use strict";

  const winston = require('winston');
  require('winston-daily-rotate-file');

  const { createLogger, format, transports } = winston;
  const { combine, timestamp, label, printf } = format;

  const LogLevel = {
    Debug: 0,
    Info: 1,
    Warn: 2,
    Error: 3
  };

  const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });

  let transport = new (winston.transports.DailyRotateFile)({
    filename: 'app-%DATE%.log',
    datePattern: 'YYYY-MM',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '14d'
  });

  const logger = createLogger({
    level: 'debug',
    format: combine(
      label({ label: 'app' }),
      timestamp(),
      myFormat
    ),
    transports: [
      new winston.transports.Console(),
      transport
    ]
  });

  let mLevel = LogLevel.Debug;

  let inst = {
    LogLevel: LogLevel,
    trace: trace,
    debug: debug,
    info: info,
    warn: warn,
    error: error
  };

  module.exports = inst;

  function trace(params) {
    logger.info('TRACE', params);
  }

  function debug() {
    log.call(this, LogLevel.Debug, arguments);
    //logger.debug(arguments);
  }

  function info() {
    log.call(this, LogLevel.Info, arguments);
    //logger.info(arguments);
  }

  function warn() {
    log.call(this, LogLevel.Warn, arguments);
    //logger.warn(arguments);
  }

  function error() {
    log.call(this, LogLevel.Error, arguments);
    //logger.error(arguments);
  }

  function log(level, params) {
    switch(level) {
      case LogLevel.Debug:
        //console.info('DEBUG', stringify(params));
        logger.debug(stringify(params));
        break;
      case LogLevel.Info:
        //console.info('INFO', stringify(params));
        logger.info(stringify(params));
        break;
      case LogLevel.Warn:
        //console.warn('WARN', stringify(params));
        logger.warn(stringify(params));
        break;
      case LogLevel.Error:
        //console.warn('ERROR', stringify(params));
        logger.error(stringify(params));
        break;
      default:
        //console.info('LOG', stringify(params));
        logger.info(stringify(params));
        break;
    }
  }

  function stringify(obj) {
    if(typeof obj !== 'object') {
      return obj;
    }

    return JSON.stringify(obj);
  }

})();
