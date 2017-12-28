import initSchema from '../core/base/init-schema'

const
  hooks = {},
  schemaOptions = {}

/**
 * Map Schema
 * @type {SchemaObjectInstance<any>}
 */
const Schema = initSchema({
  schema: {
    owner: { type: String, required: true },
    group: { type: String, required: true },
    title: { type: String, required: true }
  }
})

export default { Schema, schemaOptions, hooks }
