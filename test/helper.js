import url from 'url'

const { app } = require('../src')

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
  static getApp () {
    return app
  }
}

export default TestHelper
