import authentication from '@feathersjs/authentication'
import local from '@feathersjs/authentication-local'

import baseHooks from '../core/base/hooks'
import initSchema from '../core/base/init-schema'

const { authenticate } = authentication.hooks
const { hashPassword, protect } = local.hooks

/**
 * User Schema
 * @type {SchemaObjectInstance<any>}
 */
const Schema = initSchema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true, minLength: 6},
  location: {type: String},
  organisation: {type: String},
  auth0Id: {type: String}
})

/**
 * Schema options
 */
const schemaOptions = {}

/**
 * Add service hooks
 */
const hooks = baseHooks()
hooks.before = Object.assign(hooks.before, {
  find: [authenticate('jwt')],
  get: [authenticate('jwt')],
  create: [hashPassword()],
  update: [hashPassword(), authenticate('jwt')],
  patch: [hashPassword(), authenticate('jwt')],
  remove: [authenticate('jwt')]
})
hooks.after = Object.assign(hooks.after, {
  all: [
    /**
     * Make sure the password field is never sent to the client
     * Always must be the last hook
     */
    protect('password')
  ]
})

/**
 * Export Users Service configuration
 */
export default { Schema, schemaOptions, hooks }
