// TODO: remove duplication with src/lib/services/logging in libmb-quasar-app
import moment from 'moment'

const levels = {
  DEBUG: 2,
  ERROR: 5
}

class Logger {
  constructor (logLevel = levels.DEBUG) {
    this._logLevel = logLevel
  }

  debug (msg, context = 'anon') {
    if (this.logLevel >= levels.DEBUG) {
      Logger.write('DEBUG', msg, context)
    }
  }
  error (msg, context = 'anon') {
    if (this.logLevel >= levels.ERROR) {
      Logger.write('ERROR', msg, context)
    }
  }

  get logLevel () {
    return this._logLevel
  }

  static write (prefix, msg, context) {
    console.log(`${prefix}:${moment().unix()}:${context} - ${msg}`)
  }
}

export default {
  Logger,
  levels
}
