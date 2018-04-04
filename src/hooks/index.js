import winston from 'winston'

import hooks from '../base/hooks'

import app from './app'
import author from './handlers/author'
import method from './handlers/method'
import * as uuid5Hooks from './handlers/uuid5'
import resource from './resource'

const logger = winston.createLogger({
  level: process.env.NODE_ENV && process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
})

export {
  logger,
  hooks
}

const defaultHooks = {
  app,
  author,
  method,
  uuid5Hooks,
  resource
}

export default defaultHooks
