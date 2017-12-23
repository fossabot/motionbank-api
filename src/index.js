/* eslint-disable no-console */
import logger from 'winston'
import { app, initialize } from './core-api'
import * as pkg from '../package.json'

import mongoose from './persistence/mongoose'
import realTime from './real-time'
import resources from './resources'

//
// See config/default.json for general config
//

initialize({
  //
  // Set persistence adapter
  //
  persistence: mongoose,
  //
  // Sockets communication package
  //
  realTime: realTime,
  //
  // Mounted resources
  //
  resources: [
    resources.annotations,
    resources.maps
  ]
})

const port = app.get('port')
const server = app.listen(port)

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason))

server.on('listening', () =>
  logger.info(`${pkg.productName || pkg.name} v${pkg.version} ` +
    `started on http://%s:%d`, app.get('host'), port))
