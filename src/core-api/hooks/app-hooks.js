import baseHooks from './base-hooks'
import logger from './handlers/logger'

export default Object.assign(baseHooks, {
  before: {
    all: [ logger() ]
  },
  after: {
    all: [ logger() ]
  },
  error: {
    all: [ logger() ]
  }
})
