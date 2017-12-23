import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import logger from 'winston'

import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'

import authentication from './services/authentication'
import middleware from './middleware'
import appHooks from './hooks/app-hooks'

const app = express(feathers())

function initialize (options = {}) {
  //
  // Configuration (see config/default.json)
  //
  app.configure(configuration())

  options = Object.assign({
    persistence: null,
    realtime: null,
    resources: []
  }, options)
  const useSockets = options.realtime &&
    typeof options.realtime.provider === 'function',
    usePersistence = options.persistence &&
      typeof options.persistence.client === 'function',
    useChannels = options.realtime &&
      typeof options.realtime.channels === 'function'
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
  if (useSockets) {
    app.configure(options.realtime.provider)
  }
  if (usePersistence) {
    app.configure(options.persistence.client)
  }
  //
  // Middleware
  //
  app.configure(middleware)
  app.configure(authentication(options.persistence))
  //
  // Resources
  // see: https://github.com/motionbank/libmb-feathers-services
  //
  for (let resource of options.resources) {
    app.configure(resource, usePersistence ? options.persistence : undefined)
  }
  //
  // Event Channels
  //
  if (useChannels) {
    app.configure(options.realtime.channels)
  }
  //
  // Error handler
  //
  app.use(express.notFound())
  app.use(express.errorHandler({ logger }))
  //
  // App Hooks
  //
  app.hooks(appHooks)
}

export {
  initialize,
  app
}
