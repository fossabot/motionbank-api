import initSchema from '../core/base/init-schema'
const hooks = {}, schemaOptions = {}

/**
 * Map Schema
 * @type {SchemaObjectInstance<any>}
 */
const Schema = initSchema({
  owner: { type: String, required: true },
  title: { type: String, required: true }
})

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

export { Schema, schemaOptions, hooks }
