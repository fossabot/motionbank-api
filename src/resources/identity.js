import { initSchema } from '../base'
import hooks from '../hooks'

const
  resourceHooks = hooks.resource,
  schemaOptions = { idField: 'uuid', created: true, updated: true }

/**
 * Identity Schema
 *
 * @type {SchemaObjectInstance<any>}
 */
const Schema = initSchema({
  // TODO: maybe generate UUIDv5 from email?
  email: {type: String, required: true},
  // if using local strategy
  password: {type: String, minLength: 6, invisible: true},
  // JWT
  pkey: {type: String, invisible: true},
  // all external IDs go here
  // for querying
  sub: [String]
}, schemaOptions)

/**
 * Route access matrix by HTTP verb and OAuth grants
 */
schemaOptions.accessMatrix = {
  find: ['find:identity'],
  get: ['get:identity'],
  create: ['create:identity'],
  update: ['update:identity'],
  patch: ['update:identity'],
  remove: ['remove:identity']
}

export { Schema, schemaOptions, resourceHooks }
