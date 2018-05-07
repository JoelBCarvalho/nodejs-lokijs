var winston = require('winston');
var config = require('../config');
var logDir = process.env.LOG_DIR || config.log.dir;
var logFile = process.env.LOG_FILE || config.log.file;

module.exports = {
  initialize: initialize
};

function initialize() {
  winston.emitErrs = true;
  var tsFormat = () => (new Date()).toLocaleTimeString();

  var logger = new winston.Logger({
      transports: [
          new winston.transports.File({
              level: 'info',
              filename: './' + logDir + '/' + logFile,
              timestamp: tsFormat
          }),
          new winston.transports.Console({
              level: 'debug',
              colorize: true
          })
      ],
      exitOnError: false
  });
  
  return logger;
}
