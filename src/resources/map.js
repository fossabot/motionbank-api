import { initSchema } from '../base'
import hooks from '../hooks'
const
  resourceHooks = hooks.resource,
  schemaOptions = { idField: 'uuid', created: true, updated: true }

/**
 * Map Schema
 * @type {SchemaObjectInstance<any>}
 */
const Schema = initSchema({
  type: { type: [String], required: true },
  author: { type: String, required: true },
  title: { type: String, required: true }
}, schemaOptions)

/**
 * Route access matrix by HTTP verb and OAuth grants
 */
schemaOptions.accessMatrix = {
  find: ['find:maps'],
  get: ['get:maps'],
  create: ['create:maps'],
  update: ['update:maps'],
  patch: ['update:maps'],
  remove: ['remove:maps']
}

export { Schema, schemaOptions, resourceHooks }
