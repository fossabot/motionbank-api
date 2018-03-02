import CoreAPI from '../src/core-api'
import url from 'url'

import buildVars from '../src/build-vars'

import { logging } from '../src/base'

const logger = new logging.Logger(logging.levels.DEBUG)

class TestHelper {
  static getUrl (app, pathname) {
    const port = app.get('port') || 3030
    return url.format({
      hostname: app.get('host') || 'localhost',
      protocol: 'http',
      port,
      pathname
    })
  }
  static startServer (app, cb) {
    const listener = app.listen(app.get('port') || 3030)
    listener.once('listening', () => {
      cb(listener)
    })
  }
  static getApp () {
    const {
      annotation,
      map,
      user
    } = require('../src/resources')
    const middleware = require('../src/middleware')
    return CoreAPI.factory({
      serviceResources: {
        annotations: annotation,
        maps: map
      },
      systemResources: {
        users: user
      },
      middleware,
      logger
    }, buildVars())
  }
}

export default TestHelper
