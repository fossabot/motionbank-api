import NeDB from 'nedb'
import Persistence from '../base/persistence'

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

class NeDBPersistence extends Persistence {
  constructor (options = {}) {
    options = Object.assign({
      autoload: true
    }, options)
    super({ db: new NeDB(options) })
  }
  async find (query, params) {
    const results = await wrapAsync(this.db, 'find', query)
    return results
  }
  async get (id, params) {
    const result = await wrapAsync(this.db, 'findOne', { id })
    return result
  }
  async create (data, params) {
    const result = await wrapAsync(this.db, 'create', data)
    return result
  }
  async update (id, data, params) {
    const result = await wrapAsync(this.db, 'update', { id }, data)
    return result
  }
  async patch (id, data, params) {
    const result = await wrapAsync(this.db, 'update', { id }, data)
    return result
  }
  async remove (id, params) {
    const result = await wrapAsync(this.db, 'remove', { id })
    return result
  }
}

export default NeDBPersistence
