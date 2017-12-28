import { logger } from '../../../core'

/**
 * Logger factory for hooks
 * @returns {function(*=)}
 */
export default function () {
  return context => {
    logger.debug(`${context.type} app.service('${context.path}').${context.method}()`)
    if (typeof context.toJSON === 'function') {
      logger.debug('Hook Context', JSON.stringify(context, null, '  '))
    }
    if (context.error) {
      logger.error(context.error)
    }
  }
}
