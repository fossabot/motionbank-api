import baseHooks from '../base/hooks'
import authentication from '@feathersjs/authentication'
const { authenticate } = authentication.hooks

export default Object.assign(baseHooks, {
  before: {
    all: [authenticate('jwt')]
  }
})
