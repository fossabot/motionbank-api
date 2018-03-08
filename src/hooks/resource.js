import baseHooks from './hooks'
import ACL from './handlers/acl'
import authentication from '@feathersjs/authentication'
import merge from 'merge-deep'
const { authenticate } = authentication.hooks

const resourceHooks = merge(baseHooks(), {
  before: {
    all: [authenticate('jwt'), ACL.hook]
  }
})

export default resourceHooks
