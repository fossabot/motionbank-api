import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.NODE_ENV && process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
})

/**
 * Logger factory for hooks
 * @returns {function(*=)}
 */
export default function () {
  return context => {
    logger.log('debug', `${context.type} app.service('${context.path}').${context.method}()`)
    if (typeof context.toJSON === 'function') {
      logger.log('debug', 'Hook Context', JSON.stringify(context, null, '  '))
    }
    if (context.error) {
      logger.log('error', context.error)
    }
  }
}
