import assert from 'assert'
import mongodb from 'mongodb'
import Persistence from '../base/persistence'

const MongoClient = mongodb.MongoClient

/*
 * MongoDB persistence adapter
 */
class MongoDB extends Persistence {
  /*
   * Instantiate MongoDB persistence adapter
   */
  constructor (options = {}) {
    assert.equal(typeof options.url, 'string', 'mongodb: options.url: invalid type')
    assert.equal(typeof options.dbName, 'string', 'mongodb: options.dbName: invalid type')
    options = Object.assign({ db: null, name: options.name }, options)
    super(options)
  }

  /*
   * Establish connection to MongoDB server
   */
  async connect () {
    const client = await MongoClient.connect(this.options.url),
      database = client.db(this.options.dbName)
    this.options.db = database.collection()
  }

  /*
   * Disconnect from MongoDB server
   */
  disconnect () {
    if (this.options.db) {
      this.options.db.close()
      this.options.db = null
    }
  }

  /*
   * Check if connected to MongoDB server.
   * If not, (re-)connect immediately.
   */
  async checkConnection () {
    if (this.options.db === null) {
      await this.connect()
    }
  }

  /*
   * Find records in DB
   */
  async find (query, params) {
    await this.checkConnection()
    const results = await this.db.find(query)
    return results
  }

  /*
  * Get DB record by ID
  */
  async get (id, params) {
    await this.checkConnection()
    const result = await this.db.findOne({ id })
    return result
  }

  /*
   * Create new DB record
   */
  async create (data, params) {
    await this.checkConnection()
    const result = await this.db.create(data)
    return result
  }

  /*
   * Update (replace) DB record with data for ID
   */
  async update (id, data, params) {
    await this.checkConnection()
    const result = await this.db.updateOne({ id }, data)
    return result
  }

  /*
   * Patch (merge) DB record with data for ID
   */
  async patch (id, data, params) {
    await this.checkConnection()
    const result = await this.db.updateOne({ id }, data)
    return result
  }

  /*
   * Remove DB record with ID
   */
  async remove (id, params) {
    await this.checkConnection()
    const result = await this.db.findOneAndRemove({ id })
    return result
  }
}

export default MongoDB
