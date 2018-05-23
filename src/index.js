/**
 * Motion Bank API
 * Main Entry File
 */

import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import proxy from 'http-proxy-middleware'
import Debug from 'debug'

import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'
import opbeat from 'opbeat'
import AirbrakeClient from 'airbrake-js'

import hooks, { logger } from './hooks'
import services from './services'
import sockets from './sockets'
import persistence from './persistence'

import AuthExpress from './services/auth-express'

import { createService, Util } from './base'

import * as resources from './resources'

const debug = Debug('mbapi')

/** Opbeat for measuring app performance **/
if (process.env.USE_OPBEAT) {
  opbeat.start()
  debug('Opbeat has started.')
}

/** Airbrake for detecting exceptions and errors **/
if (process.env.USE_AIRBRAKE) {
  const airbrake = new AirbrakeClient({
    projectId: process.env.AIRBRAKE_PROJECT_ID,
    projectKey: process.env.AIRBRAKE_API_KEY
  })
  debug('Airbrake has been set up: ', (airbrake))
}

/** Debug logging when not in production **/
if (process.env.NODE_ENV !== 'production') logger.level = 'debug'

const app = express(feathers())
app.configure(configuration())

const options = {
  basePath: path.join(__dirname, '..', '..'),
  logger
}
app.set('appconf', options)
const serviceOptions = app.get('service')

/**
 * Basics
 */
app.use(cors())
app.use(helmet())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 * Filesystem
 */
const fileconf = app.get('file')
app.use(favicon(path.join(fileconf.public, 'favicon.ico')))
app.use('/', express.static(fileconf.public))

/**
 * Transport Providers
 */
app.configure(express.rest())
// app.configure(sockets.provider.primus)

/**
 * Authentication
 */
app.configure(services.AuthExpress())

/**
 * GET Request proxy
 */
app.configure(services.Proxy())
app.use('/ingest/youtube', proxy('/', {
  target: 'https://www.youtube.com',
  pathRewrite: { '^/ingest/youtube': '' },
  changeOrigin: true
}))
app.use('/ingest/vimeo', proxy('/', {
  target: 'https://vimeo.com',
  pathRewrite: { '^/ingest/vimeo': '' },
  changeOrigin: true
}))

/**
 * System Resources
 * used for basic API services
 */
let
  paginate = app.get('paginate'),
  persist = Util.parseConfig(persistence, serviceOptions.system.persistence)
persist.options.logger = logger

/**
 * ACL resource
 */
app.configure(createService({
  logger,
  paginate,
  name: 'acls',
  private: true,
  Schema: resources.acl.Schema,
  schemaOptions: resources.acl.schemaOptions
}, persist))

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

/**
 * User Auth callback
 */
app.use('/users/callback', function (req, res, next) {
  console.log(req, res)
  next()
})

/**
 * Connect resource
 */
app.configure(createService({
  logger,
  paginate,
  name: 'connects',
  Schema: resources.connect.Schema,
  schemaOptions: resources.connect.schemaOptions,
  hooks: resources.connect.resourceHooks
}, persist))

/**
 * Main Resources
 * used for core functionality
 */
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
 * Profile resource
 */
app.configure(createService({
  logger,
  paginate,
  name: 'profiles',
  Schema: resources.profile.Schema,
  schemaOptions: resources.profile.schemaOptions,
  hooks: resources.profile.resourceHooks
}, persist))

/**
 * Event Channels
 */
app.configure(sockets.channels)
/**
 * Error handlers
 */
if (process.env.USE_OPBEAT) app.use(opbeat.middleware.express())
app.use(express.notFound())
app.use(express.errorHandler({ logger: options.logger || logger }))
/**
 * App Hooks
 */
app.hooks(hooks.app)

process.on('unhandledRejection', (reason, p) =>
  process.stderr.write(`Unhandled Rejection at: Promise p:${p} reason:${reason}\n`))

const htconf = app.get('api').http
app.listen(htconf.port).on('listening', () => {
  const pkg = require('../package.json')
  process.stdout.write(`${pkg.productName || pkg.name} v${pkg.version} ` +
    `started on http://${htconf.host}:${htconf.port}\n\n`)
})

export {
  app
}
