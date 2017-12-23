import setup from '../../setup-service'
import authentication from '@feathersjs/authentication'
import local from '@feathersjs/authentication-local'

const { authenticate } = authentication.hooks
const { hashPassword, protect } = local.hooks

const users = {
  name: 'users',
  path: '/users',
  schema: {
    email: {type: String, unique: true},
    password: {type: String},
    auth0Id: {type: String}
  },
  hooks: {
    before: {
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [hashPassword()],
      update: [hashPassword(), authenticate('jwt')],
      patch: [hashPassword(), authenticate('jwt')],
      remove: [authenticate('jwt')]
    },
    after: {
      all: [
        // Make sure the password field is never sent to the client
        // Always must be the last hook
        protect('password')
      ]
    }
  }
}

export default function (backend) {
  return function (app) {
    setup(app, users, backend)
  }
}
