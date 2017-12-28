import authentication from '@feathersjs/authentication'
import local from '@feathersjs/authentication-local'

import baseHooks from '../../base/hooks'
import buildVars from '../../../build-vars'

const { authenticate } = authentication.hooks
const { hashPassword, protect } = local.hooks

/*
 * Set up the schema
 */
const schema = {
  name: {type: String, required: true},
  location: {type: String},
  organisation: {type: String},
  email: {type: String, unique: true},
  password: {type: String},
  auth0Id: {type: String}
}
schema[buildVars.idField] = { type: String, required: true, unique: true }

/*
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
    // Make sure the password field is never sent to the client
    // Always must be the last hook
    protect('password')
  ]
})

/*
 * Export Users Service configuration
 */
export default { schema, hooks }
