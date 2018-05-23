import baseHooks from '../base/hooks'
import checkMethod from './handlers/method'
import setAuthor from './handlers/author'
import ACLHooks from './handlers/acl/hooks'
import authentication from '@feathersjs/authentication'
import merge from 'deepmerge'
const { authenticate } = authentication.hooks

const resourceHooks = merge(baseHooks(), {
  before: {
    all: [checkMethod()],
    create: [setAuthor()],
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
