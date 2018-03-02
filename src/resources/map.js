import { initSchema } from '../base'
const resourceHooks = {}, schemaOptions = { idField: 'uuid' }

/**
 * Map Schema
 * @type {SchemaObjectInstance<any>}
 */
const Schema = initSchema({
  class: { type: String, required: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String }
}, schemaOptions)

/**
 * Route access matrix by HTTP verb and OAuth grants
 */
schemaOptions.accessMatrix = {
  find: ['retrieve:maps'],
  get: ['retrieve:maps'],
  create: ['create:maps'],
  update: ['update:maps'],
  patch: ['update:maps'],
  remove: ['remove:maps']
}

export { Schema, schemaOptions, resourceHooks }
