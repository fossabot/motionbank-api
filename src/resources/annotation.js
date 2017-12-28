import initSchema from '../core/base/init-schema'

const
  hooks = {},
  schemaOptions = {}

/**
 * Annotation Schema
 * @type {SchemaObjectInstance<any>}
 */
const Schema = initSchema({
  author: { type: String, required: true },
  subject: { type: String, required: true },
  object: { type: String, required: true },
  predicate: { type: String, required: true },
  context: { type: String, required: true }
})

export { Schema, schemaOptions, hooks }
