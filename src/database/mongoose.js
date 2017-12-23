import mongoose from 'mongoose'
import createService from 'feathers-mongoose'

const client = function (app) {
  mongoose.connect(app.get('mongodb'), {
    useMongoClient: true
  })
  mongoose.Promise = global.Promise
  app.set('mongooseClient', mongoose)
}

const model = function (app, resource) {
  const options = Object.assign({
    timestamps: true
  }, resource.options || {})
  const
    mongooseClient = app.get('mongooseClient'),
    { Schema } = mongooseClient,
    model = new Schema(resource.schema, options)

  return mongooseClient.model(resource.path, model)
}

export default {
  client,
  model,
  createService
}
