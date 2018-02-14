/* eslint no-return-await: off */
import Nedb from 'nedb'
import path from 'path'

import Persistence from 'libmb-base/persistence'
import Util from 'libmb-base/util'

/**
 * NeDB persistence adapter
 */
class NeDB extends Persistence {
  /**
   * Instantiate NeDB persistence adapter
   * @param options
   */
  constructor (options = {}, idField) {
    // TODO: add assertions
    options = Object.assign({
      autoload: true
    }, options)
    if (options.filename) {
      options.filename = path.resolve(path.join(__dirname, '..', '..', '..', `${options.filename}-${options.name}.nedb`))
    }
    super({ name: options.name })
    this._db = new Nedb(options)
    this.idField = idField
  }

  /**
   * Find records in DB
   * @param query
   * @param params
   * @returns {Promise<*>}
   */
  async find (query, params) {
    const { q, opts } = Util.parseQuery(query)
    return await Util.wrapAsync(this.db, 'find', q, opts)
  }

  /**
   * Get DB record by ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async get (id, params) {
    return await Util.wrapAsync(this.db, 'findOne',
      Util.getIdQuery(id, this.idField))
  }

  /**
   * Create new DB record
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async create (data, params) {
    const result = await Util.wrapAsync(this.db, 'insert', Util.getRawObject(data))
    return result
  }

  /**
   * Update (replace) DB record with data for ID
   * @param id
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async update (id, data, params) {
    return await Util.wrapAsync(this.db, 'update',
      Util.getIdQuery(id, this.idField), Util.getRawObject(data))
  }

  /**
   * Patch (merge) DB record with data for ID
   * @param id
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async patch (id, data, params) {
    return await Util.wrapAsync(this.db, 'update',
      Util.getIdQuery(id, this.idField), Util.getRawObject(data))
  }

  /**
   * Remove DB record with ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async remove (id, params) {
    return await Util.wrapAsync(this.db, 'remove',
      Util.getIdQuery(id, this.idField))
  }
}

export default NeDB
