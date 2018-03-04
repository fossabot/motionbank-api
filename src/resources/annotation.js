import { initSchema } from '../base'
const
  resourceHooks = {},
  schemaOptions = { idField: 'uuid', created: true, updated: true }

/**
 * Selector Schema
 * @type {SchemaObjectInstance<any>}
 */
const Selector = initSchema({
  type: { type: String, required: true },
  value: { type: String, required: true },
  conformsTo: { type: String }
})

/**
 * Body Schema
 * @type {SchemaObjectInstance<any>}
 */
const Body = initSchema({
  type: { type: String, required: true },
  value: { type: String },
  source: { type: String },
  purpose: { type: String },
  selector: { type: Selector }
})

/**
 * Target Schema
 * @type {SchemaObjectInstance<any>}
 */
const Target = initSchema({
  type: { type: String, required: true },
  id: { type: String, required: true },
  selector: { type: Selector }
})

/**
 * Annotation Schema
 * @type {SchemaObjectInstance<any>}
 */
const Schema = initSchema({
  type: { type: String, required: true, default: 'Annotation', readonly: true },
  author: { type: String, required: true },
  target: { type: Target, required: true },
  body: { type: Body, required: true },
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
