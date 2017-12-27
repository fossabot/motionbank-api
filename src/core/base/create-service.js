/* eslint-disable no-unused-vars, no-return-await */
import assert from 'assert'
import Schema from './init-schema'
import Persistence from './persistence'

class Service {
  constructor (options) {
    assert.equal(typeof options.schema, 'object', 'invalid schema object type')
    assert(Object.keys(options.schema).length > 0, 'invalid schema object format')

    this.options = Object.assign({}, options)
    this.Model = Schema(Object.assign(Service.defaultSchemaOptions, this.options.schema))
    this.persistence = this.options.persistence || new Persistence()
  }

  async find (params) {
    const ctx = this,
      results = await this.persistence.find(params.query, params)
    return results.map(result => {
      return ctx.Model.create(result)
    })
  }

  async get (id, params) {
    const result = await this.persistence.get(id, params)
    return result ? this.Model.create(result) : undefined
  }

  async create (data, params) {
    const ctx = this
    if (Array.isArray(data)) {
      const results = await Promise.all(data.map(entry => {
        return ctx.create(entry, params)
      }))
      return results
    }
    const obj = this.Model.create(data),
      resource = await this.persistence.create(obj.toObject(), params)
    Object.entries(resource).map((key, value) => {
      if (obj[key] !== value) obj[key] = value
    })
    return obj
  }

  async update (id, data, params) {
    const old = this.Model.create(data)
    const result = await this.persistence.update({ id }, old, params)
    return result ? data.update(result) : undefined
  }

  async patch (id, data, params) {
    const instance = await this.get(id)
    let result
    if (instance) {
      await instance.update(data)
      result = await this.persistence.update({ id }, instance, params)
    }
    return result
  }

  async remove (id, params) {
    const result = await this.persistence.findOneAndRemove({ id }, params)
    return result
  }

  static get defaultSchemaOptions () {
    return {
      dotNotation: false,
      strict: false
    }
  }
}

export default function (options = {}) {
  assert.equal(typeof options.schema, 'object', 'schema must be object')
  assert.equal(typeof options.name, 'string', 'options.name must be string')
  assert.equal(typeof options.path, 'string', 'options.path must be string')

  return function (app) {
    let service = new Service(options)
    app.use(options.path, service)
    service = app.service(options.name)
    service.hooks(options.hooks || {})
  }
}

export {
  Service
}
