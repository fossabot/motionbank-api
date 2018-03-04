import authentication from '@feathersjs/authentication'
import local from '@feathersjs/authentication-local'

import { hooks } from '../hooks'
import { initSchema } from '../base'

const { authenticate } = authentication.hooks
const { hashPassword, protect } = local.hooks

/**
 * Schema options
 */
const schemaOptions = { idField: 'uuid', created: true, updated: true }

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
  auth0Id: {type: String, invisible: true}
}, schemaOptions)

/**
 * Add service userHooks
 */
const resourceHooks = hooks()
resourceHooks.before = Object.assign(resourceHooks.before, {
  find: [authenticate('jwt')],
  get: [authenticate('jwt')],
  create: [hashPassword()],
  update: [hashPassword(), authenticate('jwt')],
  patch: [hashPassword(), authenticate('jwt')],
  remove: [authenticate('jwt')]
})
resourceHooks.after = Object.assign(resourceHooks.after, {
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
export { Schema, schemaOptions, resourceHooks }
