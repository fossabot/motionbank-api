import buildVars from '../../build-vars'

class Util {
  //
  // Static helper methods
  //

  /*
   * Create query for ID field
   */
  static getIdQuery (id) {
    const query = {}
    query[buildVars.idField] = id
    return query
  }

  /*
   * Make sure only vanilla objects get passed
   */
  static getRawObject (data) {
    if (data && typeof data.toObject === 'function') {
      return data.toObject()
    }
    return data
  }

  /*
   * Parse query input
   *
   * TODO: how should this be abstracted?
   * TODO: look into graphql
   * see: https://github.com/rollymaduk/feathers-apollo-server
   * and: https://medium.com/fuzz/the-electric-feathersjs-and-apollo-server-the-start-f338a744b34b
   */
  static parseQuery (query) {
    return Util.getRawObject(query)
  }

  /*
   * Make sure only simple vanilla objects get passed to DB
   */
  static async wrapAsync (db, method, ...args) {
    return new Promise((resolve, reject) => {
      const cb = (err, result) => {
        if (err) return reject(err)
        resolve(result)
      }
      let [a1, a2] = args
      if (a1 && a2) {
        db[method](a1, a2, cb)
      }
      else if (a1) {
        db[method](a1, cb)
      }
    })
  }
}

export default Util
