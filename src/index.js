import CoreAPI from './core-api'
import * as resources from './resources'

import buildVars from './build-vars'

const serviceResources = {
  annotations: resources.annotation,
  maps: resources.map
}

const systemResources = {
  users: resources.user
}

/**
 * libmb-feathers-api v1.0.0
 *
 * Initialize abstract API server with
 * custom configuration
 *
 * See config/default.json & production.json
 * for general config variables
 **/
const app = CoreAPI.factory({
  /**
   * System related basic resources
   *
   * - resources/users -> /users
   */
  systemResources,
  /**
   * Build Variables (see: src/buildVars.js)
   **/
  buildVars: {
    myVar: true,
    test: 'asdf'
  },
  /**
   * Services: Resources (mounted as endpoints)
   *
   * - resources/annotations -> /annotations
   * - resources/maps        -> /maps
   **/
  serviceResources,
  /**
   * Custom Middleware (Optional entry points)
   **/
  middleware: {
    /** Pre auth middleware (optional) **/
    preAuth: null,
    /** Post auth middleware (optional) **/
    postAuth: null,
    /** Post resource middleware (optional) **/
    postResource: null
  }
}, buildVars())

process.on('unhandledRejection', (reason, p) =>
  process.stderr.write(`Unhandled Rejection at: Promise p:${p} reason:${reason}\n`))

app.listen(app.get('port')).on('listening', () => {
  const pkg = require('../package.json')
  process.stdout.write(`${pkg.productName || pkg.name} v${pkg.version} ` +
    `started on http://${app.get('host')}:${app.get('port')}\n\n`)
})

export {
  app
}
