import assert from 'assert'
import Service from './service'
import errors from '@feathersjs/errors'
import hooks from 'feathers-hooks-common'

/**
 * Service factory function
 * @param options
 * @param persistence
 * @returns {Function}
 */
function createService (options = {}, persistence = undefined) {
  assert.equal(typeof options.Schema, 'function',
    'create-service: options.Schema must be function')
  assert.equal(typeof options.name, 'string',
    'create-service: options.name must be string')
  assert.equal(typeof options.schemaOptions.idField, 'string',
    'create-service: options.schemaOptions.idField must be string')

  /**
   * Service configuration
   * @type {{path: string, schemaOptions: {}} | {}}
   */
  options = Object.assign({
    path: options.path || `/${options.name}`,
    logger: options.logger
  }, options)
  options.schemaOptions = Object.assign({}, options.schemaOptions)

  /**
   * Persistence configuration
   * @type {{Constructor: Persistence, options: {}} | any}
   */
  persistence = Object.assign({
    Constructor: undefined,
    options: {}
  }, persistence)
  persistence.options = Object.assign({
    name: options.name
  }, persistence.options)

  /**
   * Register Service with app
   */
  return function (app) {
    let service = new Service(options, persistence, options.schemaOptions.idField)
    app.use(options.path, service)
    service = app.service(options.name)
    if (options.private) {
      service.hooks({ before: { all: [hooks.disallow('external')] } })
    }
    else {
      service.hooks(options.hooks || {})
    }
  }
}

export default createService
