/* eslint no-return-await: off */
import Nedb from 'nedb'

import Persistence from '../base/persistence'
import Util from '../base/util'

/*
 * NeDB persistence adapter
 */
class NeDB extends Persistence {
  /*
   * Instantiate NeDB persistence adapter
   */
  constructor (options = {}) {
    // TODO: add assertions
    options = Object.assign({
      autoload: true
    }, options)
    super({ name: options.name })
    this._db = new Nedb(options)
  }

  /*
   * Find records in DB
   */
  async find (query, params) {
    return await Util.wrapAsync(this.db, 'find',
      Util.parseQuery(query))
  }

  /*
   * Get DB record by ID
   */
  async get (id, params) {
    return await Util.wrapAsync(this.db, 'findOne',
      Util.getIdQuery(id))
  }

  /*
   * Create new DB record
   */
  async create (data, params) {
    return await Util.wrapAsync(this.db, 'insert',
      Util.getRawObject(data))
  }

  /*
   * Update (replace) DB record with data for ID
   */
  async update (id, data, params) {
    return await Util.wrapAsync(this.db, 'update',
      Util.getIdQuery(id), Util.getRawObject(data))
  }

  /*
   * Patch (merge) DB record with data for ID
   */
  async patch (id, data, params) {
    return await Util.wrapAsync(this.db, 'update',
      Util.getIdQuery(id), Util.getRawObject(data))
  }

  /*
   * Remove DB record with ID
   */
  async remove (id, params) {
    return await Util.wrapAsync(this.db, 'remove',
      Util.getIdQuery(id))
  }
}

export default NeDB
