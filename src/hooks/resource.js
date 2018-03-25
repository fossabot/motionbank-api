import baseHooks from '../base/hooks'
import checkMethod from './method'
import ACLHooks from './handlers/acl/hooks'
import authentication from '@feathersjs/authentication'
import merge from 'merge-deep'
const { authenticate } = authentication.hooks

const resourceHooks = merge(baseHooks(), {
  before: {
    all: [authenticate('jwt'), checkMethod()],
    get: [ACLHooks.permissionHook],
    update: [ACLHooks.permissionHook],
    patch: [ACLHooks.permissionHook],
    remove: [ACLHooks.permissionHook, ACLHooks.removeACLHook]
  },
  after: {
    find: [ACLHooks.filterHook],
    create: [ACLHooks.createACLHook]
  }
})

export default resourceHooks
