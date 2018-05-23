import authentication from '@feathersjs/authentication'
import local from '@feathersjs/authentication-local'
import merge from 'deepmerge'

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
  auth0Id: {type: String, invisible: true},
  scopes: {type: [String], invisible: true}
}, schemaOptions)

/**
 * Add service userHooks
 */
const resourceHooks = hooks()
resourceHooks.before = merge(resourceHooks.before, {
  // find: [authenticate('jwt')],
  get: [
    // authenticate('jwt'),
    function (context) {
      if (context.id === 'me') {
        context.id = context.params.user ? context.params.user.sub : context.id
      }
    }
  ],
  create: [hashPassword()],
  update: [hashPassword(), authenticate('jwt')],
  patch: [hashPassword(), authenticate('jwt')],
  remove: [authenticate('jwt')]
})
resourceHooks.after = merge(resourceHooks.after, {
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
  find: ['find:users'],
  get: ['get:users'],
  create: ['create:users'],
  update: ['update:users'],
  patch: ['patch:users'],
  remove: ['remove:users']
}

/**
 * Export Users Service configuration
 */
export { Schema, schemaOptions, resourceHooks }
