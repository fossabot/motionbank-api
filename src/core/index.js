import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import logger from 'winston'

import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'

import services from './services'
import hooks from './hooks'
import sockets from './sockets'
import persistence from './persistence'

import createService from './base/create-service'
import Util from './base/util'
import buildVars from '../build-vars'

/** Debug logging when not in production **/
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug'
}

// TODO: this file needs to shrink!

function init (options = {}) {
  /**
   * Configuration (see config/default.json)
   */
  const app = express(feathers())
  app.configure(configuration())
  options = Object.assign({
    resources: [],
    middleware: {
      preAuth: Object.assign({}, options.middleware.preAuth),
      postAuth: Object.assign({}, options.middleware.postAuth),
      postResource: Object.assign({}, options.middleware.postResource)
    },
    buildVars: Object.assign(buildVars(), options.buildVars),
    logger
  }, options)
  options.basePath = options.basePath && options.basePath[0] === path.sep
    ? path.resolve(options.basePath) : path.join(__dirname, '..', '..')
  app.set('appconf', options)
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
   * Transport Provider
   */
  app.configure(express.rest())
  app.configure(sockets.provider.primus)
  /**
   * Pre auth middleware
   */
  if (options.middleware.preAuth) {
    app.configure(options.middleware.preAuth)
  }
  /**
   * Authentication & Users
   */
  const authConfig = app.get('authentication'),
    parsed = Util.parseConfig(authConfig.persistence)
  app.configure(services.authentication())
  app.configure(createService({
    name: 'users',
    paginate: app.get('paginate'),
    schema: services.config.users.schema,
    hooks: services.config.users.hooks
  }, parsed))
  /**
   * ACL (Access Control List)
   * with backends:
   *
   * - memoryBackend
   * - redisBackend
   * - mongoBackend
   */
  const ACLBackend = services.ACL.memoryBackend
  app.set('acl', new services.ACL(new ACLBackend()))
  app.configure(app.get('acl').middleware)
  /**
   * Post auth middleware
   */
  if (options.middleware.postAuth) {
    app.configure(options.middleware.postAuth)
  }
  /**
   * Resources
   */
  const resConfig = app.get('resources')
  for (let [key, value] of Object.entries(options.resources)) {
    const persist = Util.parseConfig(resConfig.persistence)
    persist.options = Object.assign(persist.options || {}, {
      filename: path.join(options.basePath,
        persist.options.path, `${persist.options.prefix || ''}${key}.nedb`)
    })
    app.configure(createService({
      name: key,
      paginate: app.get('paginate'),
      schema: value.schema,
      schemaOptions: value.schemaOptions,
      hooks: hooks.resource
    }, persist))
  }
  /**
   * Post resource middleware
   */
  if (options.middleware.postResource) {
    app.configure(options.middleware.postResource)
  }
  /**
   * Event Channels
   */
  app.configure(sockets.channels)
  /**
   * Error handler
   */
  app.use(express.notFound())
  app.use(express.errorHandler({ logger: options.logger || logger }))
  /**
   * App Hooks
   */
  app.hooks(hooks.app)

  return app
}

export default {
  /**
   * Core API Factory function
   */
  init
}

export {
  /**
   * API parts
   */
  hooks,
  services,
  sockets,
  persistence,
  logger
}
