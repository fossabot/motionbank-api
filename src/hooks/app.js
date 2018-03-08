import baseHooks from './hooks'
import logger from './handlers/logger'
import merge from 'merge-deep'

export default merge(baseHooks(), {
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
