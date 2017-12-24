/* eslint-disable no-console */
import logger from 'winston'
import { app, initialize, services } from './core'
import * as pkg from '../package.json'

import resources from './resources'
import middleware from './middleware'

//
// See config/default.json for general config
//
initialize({
  //
  // Mounted resources
  //
  resources: [
    resources.annotations,
    resources.maps
  ],
  //
  // Adding middleware (entry points pre-auth,
  // post-auth and post-resource)
  //
  middleware: {
    preAuth: middleware,
    postAuth: null,
    postResource: null
  }
})

const port = app.get('port')
const server = app.listen(port)

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason))

server.on('listening', () =>
  logger.info(`${pkg.productName || pkg.name} v${pkg.version} ` +
    `started on http://%s:%d`, app.get('host'), port))

export {
  resources,
  services
}
