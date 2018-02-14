import baseHooks from 'libmb-base/hooks'
import authentication from '@feathersjs/authentication'
const { authenticate } = authentication.hooks

export default Object.assign(baseHooks, {
  before: {
    all: [authenticate('jwt')]
  }
})
