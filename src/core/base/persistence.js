/* eslint no-return-await: off */
import assert from 'assert'

/**
 * @module Persistence
 * Base persistence adapter
 */
class Persistence {
  /**
   * Instantiates persistence adapter and sets options
   * @param options
   * @param db
   */
  constructor (options, db = null) {
    assert.equal(typeof options.name, 'string',
      'persistence: options.name must be valid collection name')
    this._options = options || {}
    this._db = db
  }

  /**
   * Dummy find method
   * @param query
   * @param params
   * @returns {Promise<*[]>}
   */
  async find (query, params) {
    console.log('WARNING: dummy persistence find')
    return await Promise.resolve([
      {id: 1, text: `A new message with ID: 1!`},
      {id: 2, text: `A new message with ID: 1!`}
    ])
  }

  /**
   * Dummy get method
   * @param id
   * @param params
   * @returns {Promise<{id: *, text: string}>}
   */
  async get (id, params) {
    console.log('WARNING: dummy persistence get')
    return await Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    })
  }

  /**
   * Dummy create method
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async create (data, params) {
    console.log('WARNING: dummy persistence create')
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current)))
    }
    return await Promise.resolve(data)
  }

  /**
   * Dummy update method
   * @param id
   * @param data
   * @param params
   * @returns {Promise<any>}
   */
  async update (id, data, params) {
    console.log('WARNING: dummy persistence update')
    return await Promise.resolve(data)
  }

  /**
   * Dummy patch method
   * @param id
   * @param data
   * @param params
   * @returns {Promise<any>}
   */
  async patch (id, data, params) {
    console.log('WARNING: dummy persistence patch')
    return await Promise.resolve(data)
  }

  /**
   * Dummy remove method
   * @param id
   * @param params
   * @returns {Promise<{id: *}>}
   */
  async remove (id, params) {
    console.log('WARNING: dummy persistence remove')
    return await Promise.resolve({ id })
  }

  /**
   * Get DB client instance
   * @returns {*}
   */
  get db () {
    return this._db
  }

  /**
   * Get DB client options
   * @returns {*|{}}
   */
  get options () {
    return this._options
  }
}

export default Persistence
