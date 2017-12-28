import assert from 'assert'
import Service from './service'
import Persistence from './persistence'

/*
 * Service factory function
 */
function createService (options = {}, persistence = undefined) {
  assert.equal(typeof options.schema, 'object',
    'create-service: options.schema must be object')
  assert.equal(typeof options.name, 'string',
    'create-service: options.name must be string')

  options = Object.assign({
    path: options.path || `/${options.name}`,
    schemaOptions: {}
  }, options)
  options.schemaOptions = Object.assign({}, options.schemaOptions)

  persistence = Object.assign({
    Constructor: Persistence,
    options: {}
  }, persistence)
  persistence.options = Object.assign({
    name: options.name
  }, persistence.options)

  return function (app) {
    let service = new Service(options, persistence)
    app.use(options.path, service)
    service = app.service(options.name)
    service.hooks(options.hooks || {})
  }
}

export default createService
