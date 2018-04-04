import { initSchema } from '../base'
import hooks from '../hooks'

const
  resourceHooks = hooks.resource,
  schemaOptions = { idField: 'uuid', created: true, updated: true }

/**
 * Profile Schema
 * @type {SchemaObjectInstance<any>}
 */
const Schema = initSchema({

  // single field name
  name: { type: String },
  // double field name
  firstname: { type: String },
  lastname: { type: String },

  // organisational
  location: { type: String },
  latlon: [Number],
  organisation: { type: String },

  // personal
  birthday: { type: Date },
  nickname: { type: String },
  imageURL: { type: String },
  title: { type: String },
  gender: { type: String },

  // profile creator UUID
  author: { type: String, required: true },

  // UUID of 'Connect' object holding
  // external userIDs, etc.
  connect: { type: String, required: true }

}, schemaOptions)

/**
 * Route access matrix by HTTP verb and OAuth grants
 */
schemaOptions.accessMatrix = {
  find: ['find:profiles'],
  get: ['get:profiles'],
  create: ['create:profiles'],
  update: ['update:profiles'],
  patch: ['update:profiles'],
  remove: ['remove:profiles']
}

export { Schema, schemaOptions, resourceHooks }
