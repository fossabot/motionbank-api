import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import logger from 'winston'
import assert from 'assert'

import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'

import authentication from './services/authentication'
import hooks from './hooks'
import services from './services'
import sockets from './sockets'

const app = express(feathers())

function initialize (options = {}) {
  assert.ok(app instanceof Object, 'Fatal: Invalid app object.')

  //
  // Configuration (see config/default.json)
  //
  app.configure(configuration())
  options = Object.assign({
    persistence: null,
    resources: [],
    middleware: {}
  }, options)
  const usePersistence = options.persistence &&
    typeof options.persistence.client === 'function'

  //
  // Basics
  //
  app.use(cors())
  app.use(helmet())
  app.use(compress())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
  app.use('/', express.static(app.get('public')))
  //
  // Provider
  //
  app.configure(express.rest())
  app.configure(sockets.provider.primus)
  if (usePersistence) {
    app.configure(options.persistence.client)
  }
  //
  // Middleware
  //
  if (options.middleware.preAuth) {
    app.configure(options.middleware.preAuth)
  }
  app.configure(authentication(options.persistence))
  if (options.middleware.postAuth) {
    app.configure(options.middleware.postAuth)
  }
  //
  // Resources
  //
  for (let resource of options.resources) {
    app.configure(resource(options.persistence))
  }
  if (options.middleware.postResource) {
    app.configure(options.middleware.postResource)
  }
  //
  // Event Channels
  //
  app.configure(sockets.channels)
  //
  // Error handler
  //
  app.use(express.notFound())
  app.use(express.errorHandler({ logger }))
  //
  // App Hooks
  //
  app.hooks(hooks.app)
}

export {
  initialize,
  app,
  hooks,
  services
}
