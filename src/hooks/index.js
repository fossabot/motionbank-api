import winston from 'winston'

import hooks from '../base/hooks'

import app from './app'
import method from './handlers/method'
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
  method,
  resource
}

export default defaultHooks
