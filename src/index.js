/* eslint-disable no-console */
import logger from 'winston'
import app from './app'
import * as pkg from '../package.json'

const port = app.get('port')
const server = app.listen(port)

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason))

server.on('listening', () =>
  logger.info(`${pkg.productName || pkg.name} v${pkg.version} ` +
    `started on http://%s:%d`, app.get('host'), port))
