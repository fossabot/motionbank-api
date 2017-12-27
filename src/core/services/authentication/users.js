import authentication from '@feathersjs/authentication'
import local from '@feathersjs/authentication-local'

import baseHooks from '../../base/hooks'

const { authenticate } = authentication.hooks
const { hashPassword, protect } = local.hooks

const users = {
  schema: {
    name: {type: String, required: true},
    location: {type: String},
    organisation: {type: String},
    email: {type: String, unique: true},
    password: {type: String},
    auth0Id: {type: String}
  },
  hooks: {
    before: Object.assign(baseHooks.before, {
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [hashPassword()],
      update: [hashPassword(), authenticate('jwt')],
      patch: [hashPassword(), authenticate('jwt')],
      remove: [authenticate('jwt')]
    }),
    after: Object.assign(baseHooks.after, {
      all: [
        // Make sure the password field is never sent to the client
        // Always must be the last hook
        protect('password')
      ]
    }),
    error: Object.assign(baseHooks.error, {})
  }
}

export default users
