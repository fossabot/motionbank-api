// TODO: remove duplication with src/lib/services/logging in libmb-quasar-app
import moment from 'moment'

const levels = {
  DEBUG: 2,
  ERROR: 5
}

/**
 * Abstract logging class
 */
class Logger {
  /**
   * Create a logger
   * @param logLevel
   */
  constructor (logLevel = levels.DEBUG) {
    this._logLevel = logLevel
  }

  /**
   * Log a debug message
   * @param msg
   * @param context
   */
  debug (msg, context = 'anon') {
    if (this.logLevel >= levels.DEBUG) {
      Logger.write('DEBUG', msg, context)
    }
  }

  /**
   * Log an error
   * @param msg
   * @param context
   */
  error (msg, context = 'anon') {
    if (this.logLevel >= levels.ERROR) {
      Logger.write('ERROR', msg, context)
    }
  }

  /**
   * Get current loglevel
   * @returns {number|*}
   */
  get logLevel () {
    return this._logLevel
  }

  /**
   * Write the message to console or elsewhere...
   * TODO: needs more logging transports (also: winston?)
   * @param prefix
   * @param msg
   * @param context
   */
  static write (prefix, msg, context) {
    console.log(`${prefix}:${moment().unix()}:${context} - ${msg}`)
  }
}

export default {
  Logger,
  levels
}
