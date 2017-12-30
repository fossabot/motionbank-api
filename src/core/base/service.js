/* eslint no-return-await: off */
import assert from 'assert'
import Util from './util'
import buildVars from '../../build-vars'

const idField = buildVars().idField

/**
 * Service base class
 */
class Service {
  /**
   * Create a new Service instance
   * @param options
   * @param persistence
   */
  constructor (options, persistence) {
    assert(options && persistence,
      'service: invalid arguments')
    assert.equal(typeof options.Schema, 'function',
      'service: invalid schema type')
    assert.equal(typeof persistence.Constructor, 'function',
      'service: invalid persistence constructor')

    this._options = options
    this._persistence = persistence
    this._Model = this.options.Schema
    this._client = new this.persistence.Constructor(this.persistence.options)
  }

  /**
   * Find resources
   * @param params
   * @returns {Promise<void>}
   */
  async find (params) {
    const results = await this.client.find(params.query, params)
    return results
  }

  /**
   * Get resource by ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async get (id, params) {
    const result = await this.client.get(id, params)
    return Util.formatServiceResult(result, false)
  }

  /**
   * Create resource(s)
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async create (data, params) {
    const ctx = this
    if (Array.isArray(data)) {
      const results = await Promise.all(data.map(entry => {
        return ctx.create(entry, params)
      }))
      return results
    }
    // TODO: allow for full array inserts instead just single requests
    const instance = new this.ModelConstructor(data),
      result = await this.client.create(instance, params)
    instance.update(result)
    return Util.formatServiceResult(instance)
  }

  /**
   * Update (replace) resource by ID with data
   * @param id
   * @param data
   * @param params
   * @returns {Promise<undefined>}
   */
  async update (id, data, params) {
    const instance = await this.get(id)
    if (instance) {
      // TODO: transactions anyone?!
      const instance = await this.get(id)
      instance.update(data)
      const result = await this.client.update(id, instance, params)
      instance.update(result)
      return Util.formatServiceResult(instance)
    }
  }

  /**
   * Update (merge) resource by ID with data
   * @param id
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async patch (id, data, params) {
    const instance = await this.get(id)
    if (instance) {
      instance.update(data)
      const result = await this.client.update(id, instance, params)
      instance.update(result)
      return Util.formatServiceResult(instance)
    }
  }

  /**
   * Remove resource by ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async remove (id, params) {
    return await { data: this.client.remove(id, params) }
  }

  /**
   * Get persistence configuration
   * @returns {*}
   */
  get persistence () {
    return this._persistence
  }

  /**
   * Get persistence client instance
   * @returns {*}
   */
  get client () {
    return this._client
  }

  /**
   * Get service options
   * @returns {*}
   */
  get options () {
    return this._options
  }

  get id () {
    return idField
  }

  /**
   * Get Schema model constructor
   * @returns {*}
   * @constructor
   */
  get ModelConstructor () {
    return this._Model
  }
}

export default Service
