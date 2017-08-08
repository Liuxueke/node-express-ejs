/**
 * Created by MZ on 2017/6/27.
 */
const log4js = require('log4js');
const loggerOptions=require('../config').loggerOptions;

log4js.configure(loggerOptions);
levels = {
  'trace':log4js.levels.TRACE,
  'debug':log4js.levels.DEBUG,
  'info':log4js.levels.INFO,
  'warn':log4js.levels.WARN,
  'error':log4js.levels.ERROR,
  'fatal':log4js.levels.FATAL
};
exports.logger = function () {
  var logger = log4js.getLogger('access');
  return logger;
};

exports.use = function (app, level) {
  app.use(log4js.connectLogger(log4js.getLogger('access'), {
    level: levels[level] || levels['debug'],
    format: ':method :url :status'
  }));
};