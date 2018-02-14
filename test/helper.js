import CoreAPI from '../src/core'
import url from 'url'

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
      middleware
    })
  }
}

export default TestHelper
