import assert from 'assert'

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
    assert.equal(typeof options.schema, 'function',
      'service: invalid schema type')
    assert.equal(typeof persistence.Constructor, 'function',
      'service: invalid persistence constructor')

    this._options = options
    this._persistence = persistence
    this._Model = this.options.schema
    this._client = new this.persistence.Constructor(this.persistence.options)
  }

  /**
   * Find resources
   * @param params
   * @returns {Promise<void>}
   */
  async find (params) {
    const ctx = this,
      results = await this.client.find(params.query, params)
    return results.map(result => {
      return ctx.ModelConstructor.create(result)
    })
  }

  /**
   * Get resource by ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async get (id, params) {
    const result = await this.client.get(id, params)
    return result ? this.ModelConstructor.create(result) : undefined
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
    const obj = this.ModelConstructor.create(data),
      resource = await this.client.create(obj, params)
    Object.entries(resource).map(entry => {
      if (obj[entry.key] !== entry.value) obj[entry.key] = entry.value
    })
    return obj
  }

  /**
   * Update (replace) resource by ID with data
   * @param id
   * @param data
   * @param params
   * @returns {Promise<undefined>}
   */
  async update (id, data, params) {
    const old = this.ModelConstructor.create(data)
    const result = await this.client.update({ id }, old, params)
    return result ? data.update(result) : undefined
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
    let result
    if (instance) {
      await instance.update(data)
      result = await this.client.update({ id }, instance, params)
    }
    return result
  }

  /**
   * Remove resource by ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async remove (id, params) {
    const result = await this.client.remove({ id }, params)
    return result
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

  /**
   * Get Schema model constructor
   * @returns {*}
   * @constructor
   */
  get ModelConstructor () {
    return this._Model
  }

  /**
   * Get default options for schema
   * @returns {{dotNotation: boolean, strict: boolean}}
   */
  static get defaultSchemaOptions () {
    return {
      dotNotation: false,
      strict: false
    }
  }
}

export default Service
