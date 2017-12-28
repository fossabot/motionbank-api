import assert from 'assert'

/*
 * Base persistence adapter
 */
class Persistence {
  /*
   * Instantiates persistence adapter and sets options
   */
  constructor (options, db = null) {
    assert.equal(typeof options.name, 'string', 'persistence: options.name must be valid collection name')
    this._options = options || {}
    this._db = db
  }

  /*
   * Dummy find method
   */
  async find (query, params) {
    console.log('WARNING: dummy persistence find')
    return [
      { id: 1, text: 'A new message with ID: 1!' },
      { id: 2, text: 'A new message with ID: 2!' }
    ]
  }

  /*
   * Dummy get method
   */
  async get (id, params) {
    console.log('WARNING: dummy persistence get')
    return {
      id, text: `A new message with ID: ${id}!`
    }
  }

  /*
   * Dummy create method
   */
  async create (data, params) {
    console.log('WARNING: dummy persistence create')
    if (Array.isArray(data)) {
      await Promise.all(data.map(current => this.create(current)))
    }
    return data
  }

  /*
   * Dummy update method
   */
  async update (id, data, params) {
    console.log('WARNING: dummy persistence update')
    return Promise.resolve(data)
  }

  /*
   * Dummy patch method
   */
  async patch (id, data, params) {
    console.log('WARNING: dummy persistence patch')
    return Promise.resolve(data)
  }

  /*
   * Dummy remove method
   */
  async remove (id, params) {
    console.log('WARNING: dummy persistence remove')
    return Promise.resolve({ id })
  }

  /*
   * Get DB client instance
   */
  get db () {
    return this._db
  }

  /*
   * Get DB client options
   */
  get options () {
    return this._options
  }
}

export default Persistence
