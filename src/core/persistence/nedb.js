import NeDB from 'nedb'
import Persistence from '../base/persistence'

/*
 * NeDB persistence adapter
 */
class NeDBPersistence extends Persistence {
  /*
   * Instantiate NeDB persistence adapter
   */
  constructor (options = {}) {
    options = Object.assign({
      autoload: true
    }, options)
    super({ db: new NeDB(options), name: options.name })
  }

  /*
   * Find records in DB
   */
  async find (query, params) {
    const results = await wrapAsync(this.db, 'find', query)
    return results
  }

  /*
   * Get DB record by ID
   */
  async get (id, params) {
    const result = await wrapAsync(this.db, 'findOne', { id })
    return result
  }

  /*
   * Create new DB record
   */
  async create (data, params) {
    const result = await wrapAsync(this.db, 'create', data)
    return result
  }

  /*
   * Update (replace) DB record with data for ID
   */
  async update (id, data, params) {
    const result = await wrapAsync(this.db, 'update', { id }, data)
    return result
  }

  /*
   * Patch (merge) DB record with data for ID
   */
  async patch (id, data, params) {
    const result = await wrapAsync(this.db, 'update', { id }, data)
    return result
  }

  /*
   * Remove DB record with ID
   */
  async remove (id, params) {
    const result = await wrapAsync(this.db, 'remove', { id })
    return result
  }
}

function wrapAsync (db, method, query, params) {
  return new Promise((resolve, reject) => {
    const cb = (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    }
    if (params) {
      db[method](query, params, cb)
    }
    else {
      db[method](query, cb)
    }
  })
}

export default NeDBPersistence
