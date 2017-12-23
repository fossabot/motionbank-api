/* eslint-disable no-console */
import logger from 'winston'
import { app, initialize } from './core-api'
import * as pkg from '../package.json'

import mongoose from './persistence/mongoose'
import realtime from './realtime'
import resources from './resources'

initialize({
  persistence: mongoose,
  realtime: realtime,
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
