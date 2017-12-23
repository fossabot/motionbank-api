import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import logger from 'winston'

import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'

import resources from 'libmb-feathers-services'
import authentication from './auth/authentication'
import mongoose from './database/mongoose'
import realtime from './realtime'
import middleware from './middleware'
import appHooks from './hooks/app-hooks'

const app = express(feathers())

//
// Configuration (see config/default.json)
//
app.configure(configuration())
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
app.configure(realtime.provider)
app.configure(mongoose.client)
//
// Middleware
//
app.configure(middleware)
app.configure(authentication)
//
// Resources
// see: https://github.com/motionbank/libmb-feathers-services
//
app.configure(resources.annotations, mongoose)
app.configure(resources.maps, mongoose)
app.configure(resources.users, mongoose)
//
// Event Channels
//
app.configure(realtime.channels)
//
// Error handler
//
app.use(express.notFound())
app.use(express.errorHandler({ logger }))
//
// App Hooks
//
app.hooks(appHooks)

export default app
