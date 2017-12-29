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
  password: {type: String, required: true, minLength: 6, invisible: true},
  location: {type: String},
  organisation: {type: String},
  auth0Id: {type: String, invisible: true}
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
 * Route access matrix by HTTP verb and OAuth grants
 */
schemaOptions.accessMatrix = {
  find: ['retrieve:users'],
  get: ['retrieve:users'],
  create: ['create:users'],
  update: ['update:users'],
  patch: ['update:users'],
  remove: ['remove:users']
}

/**
 * Export Users Service configuration
 */
export { Schema, schemaOptions, hooks }
