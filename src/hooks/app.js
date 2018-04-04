import baseHooks from '../base/hooks'
import logger from './handlers/logger'
import { getLocalNamespace } from './handlers/uuid5'
import merge from 'merge-deep'

export default merge(baseHooks(), {
  before: {
    all: [ getLocalNamespace(), logger() ]
  },
  after: {
    all: [ logger() ]
  },
  error: {
    all: [ logger() ]
  }
})
