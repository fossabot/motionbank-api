import baseHooks from './hooks'
import authentication from '@feathersjs/authentication'
const { authenticate } = authentication.hooks

const resourceHooks = Object.assign(baseHooks(), {
  before: {
    all: [authenticate('jwt')]
  }
})

export default resourceHooks
