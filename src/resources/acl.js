import { initSchema } from '../base'
import hooks from '../hooks'
const
  resourceHooks = hooks.resource,
  schemaOptions = { idField: 'uuid' }

/**
 * Map Schema
 * @type {SchemaObjectInstance<any>}
 */
const Schema = initSchema({
  uuid: { type: String, required: true },
  actions: { type: [String], required: true },
  resource: { type: String, required: true },
  user: { type: String, required: true }
}, schemaOptions)

/**
 * Route access matrix by HTTP verb and OAuth grants
 */
schemaOptions.accessMatrix = {
  find: ['retrieve:acls'],
  get: ['retrieve:acls'],
  create: ['create:acls'],
  update: ['update:acls'],
  patch: ['update:acls'],
  remove: ['remove:acls']
}

export { Schema, schemaOptions, resourceHooks }
