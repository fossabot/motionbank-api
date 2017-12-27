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
import users from './services/authentication/users'
import sockets from './sockets'
import persistence from './persistence'

import createService from './base/create-service'

const app = express(feathers())

function initialize (options = {}) {
  assert.ok(app instanceof Object, 'Fatal: Invalid app object.')

  //
  // Configuration (see config/default.json)
  //
  app.configure(configuration())
  options = Object.assign({
    resources: [],
    middleware: {}
  }, options)

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
  //
  // Middleware
  //
  if (options.middleware.preAuth) {
    app.configure(options.middleware.preAuth)
  }
  app.configure(authentication())
  app.configure(createService({
    name: 'users',
    paginate: app.get('paginate'),
    schema: users.schema,
    hooks: users.hooks
  }, {
    // Creates MongoDB-backed service
    Constructor: persistence.MongoDB,
    options: {
      url: 'mongodb://localhost:27017',
      dbName: 'libmb_fapi_test'
    }
  }))
  if (options.middleware.postAuth) {
    app.configure(options.middleware.postAuth)
  }
  //
  // Resources
  //
  for (let [key, value] of Object.entries(options.resources)) {
    app.configure(createService({
      name: key,
      paginate: app.get('paginate'),
      schema: value.schema,
      schemaOptions: value.schemaOptions,
      hooks: hooks.resource
    }, {
      // Creates NeDB-backed service
      Constructor: persistence.NeDBPersistence,
      options: {
        // Default in-memory only, can persist to file
        // filename: path.join(__dirname, '..', '..', 'meters.db')
      }
    }))
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
  services,
  persistence
}
