import { initSchema } from '../base'
const resourceHooks = {}, schemaOptions = { idField: 'uuid' }

/**
 * Annotation Schema
 * @type {SchemaObjectInstance<any>}
 */
const Schema = initSchema({
  author: { type: String, required: true },
  target: { type: String, required: true },
  body: { type: String, required: true },
  motivation: { type: String },
  context: { type: String }
}, schemaOptions)

/**
 * Route access matrix by HTTP verb and OAuth grants
 */
schemaOptions.accessMatrix = {
  find: ['retrieve:annotations'],
  get: ['retrieve:annotations'],
  create: ['create:annotations'],
  update: ['update:annotations'],
  patch: ['update:annotations'],
  remove: ['remove:annotations']
}

export { Schema, schemaOptions, resourceHooks }
