import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'

import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'

import hooks, { logger } from './hooks'
import services from './services'
import sockets from './sockets'
import persistence from './persistence'

import { createService, Util } from './base'

import * as resources from './resources'

import buildVars from './build-vars'

/** Debug logging when not in production **/
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug'
}

const app = express(feathers())
app.configure(configuration())

const options = {
  buildVars: buildVars(),
  logger,
  basePath: path.join(__dirname, '..', '..')
}
app.set('appconf', options)
const serviceOptions = app.get('services')

/**
 * Basics
 */
app.use(cors())
app.use(helmet())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
app.use('/', express.static(app.get('public')))
/**
 * Transport Providers
 */
app.configure(express.rest())
app.configure(sockets.provider.primus)

/**
 * Authentication
 * TODO: needs a whole lotta fixin'
 */
app.configure(services.Authentication())

/**
 * ACL (Access Control List)
 * with backends:
 *
 * - memoryBackend
 * - redisBackend
 * - mongoBackend
 */
const ACLBackend = services.ACL.memoryBackend
app.set('acl', new services.ACL(new ACLBackend(), buildVars()))
// app.configure(app.get('acl').middleware)

/**
 * GET Request proxy
 */
app.configure(services.Proxy())

/**
 * System Resources
 * used for basic API services
 */
let
  paginate = app.get('paginate'),
  persist = Util.parseConfig(persistence, serviceOptions.system.persistence)
persist.options.logger = logger

/**
 * User resource
 */
app.configure(createService({
  logger,
  paginate,
  name: 'users',
  Schema: resources.user.Schema,
  schemaOptions: resources.user.schemaOptions,
  hooks: resources.user.resourceHooks
}, persist))

persist = Util.parseConfig(persistence, serviceOptions.resources.persistence)
persist.options.logger = logger
/**
 * Annotation resource
 */
app.configure(createService({
  logger,
  paginate,
  name: 'annotations',
  Schema: resources.annotation.Schema,
  schemaOptions: resources.annotation.schemaOptions,
  hooks: resources.annotation.resourceHooks
}, persist))

/**
 * Map resource
 */
app.configure(createService({
  logger,
  paginate,
  name: 'maps',
  Schema: resources.map.Schema,
  schemaOptions: resources.map.schemaOptions,
  hooks: resources.map.resourceHooks
}, persist))

/**
 * Event Channels
 */
app.configure(sockets.channels)
/**
 * Error handlers
 */
app.use(express.notFound())
app.use(express.errorHandler({ logger: options.logger || logger }))
/**
 * App Hooks
 */
app.hooks(hooks.app)

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
