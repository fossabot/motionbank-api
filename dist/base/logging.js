'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const levels = {
  DEBUG: 2,
  ERROR: 5

  /**
   * Abstract logging class
   */
}; // TODO: remove duplication with src/lib/services/logging in libmb-quasar-app
class Logger {
  /**
   * Create a logger
   * @param logLevel
   */
  constructor(logLevel = levels.DEBUG) {
    this._logLevel = logLevel;
  }

  /**
   * Log a debug message
   * @param msg
   * @param context
   */
  debug(msg, context = 'anon') {
    if (this.logLevel >= levels.DEBUG) {
      Logger.write('DEBUG', msg, context);
    }
  }

  /**
   * Log an error
   * @param msg
   * @param context
   */
  error(msg, context = 'anon') {
    if (this.logLevel >= levels.ERROR) {
      Logger.write('ERROR', msg, context);
    }
  }

  /**
   * Get current loglevel
   * @returns {number|*}
   */
  get logLevel() {
    return this._logLevel;
  }

  /**
   * Write the message to console or elsewhere...
   * TODO: needs more logging transports (also: winston?)
   * @param prefix
   * @param msg
   * @param context
   */
  static write(prefix, msg, context) {
    console.log(`${prefix}:${(0, _moment2.default)().unix()}:${context} - ${msg}`);
  }
}

exports.default = {
  Logger,
  levels
};
module.exports = exports['default'];