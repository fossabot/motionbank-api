/* eslint no-return-await: off */

import assert from 'assert'
import mongodb from 'mongodb'
import logging from '../base/logging'
import Persistence from '../base/persistence'
import Util from '../base/util'

const logger = new logging.Logger(logging.levels.DEBUG)
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
    options = Object.assign({ name: options.name }, options)
    super(options, null)
  }

  /*
   * Establish connection to MongoDB server
   */
  async connect () {
    const client = await MongoClient.connect(this.options.url),
      database = client.db(this.options.dbName)
    this._db = database.collection(this.options.name)

    logger.debug('MongoDB connected to ' +
      `${this.options.url}/${this.options.dbName} with collection '${this.options.name}'`, 'connect')
  }

  /*
   * Disconnect from MongoDB server
   */
  disconnect () {
    if (this.db) {
      logger.debug('MongoDB disconnecting...', 'disconnect')
      this.db.close()
      this._db = null
    }
  }

  /*
   * Check if connected to MongoDB server.
   * If not, (re-)connect immediately.
   */
  async checkConnection () {
    if (!this.db) {
      logger.debug(`MongoDB DB: ${JSON.stringify(this.db)}, reconnecting...`, 'checkConnection')
      await this.connect()
    }
    return (this.db)
  }

  /*
   * Find records in DB
   */
  async find (query, params) {
    if (await this.checkConnection()) {
      return await this.db.find(Util.parseQuery(query))
    }
  }

  /*
  * Get DB record by ID
  */
  async get (id, params) {
    if (await this.checkConnection()) {
      return await this.db.findOne(Util.getIdQuery(id))
    }
  }

  /*
   * Create new DB record
   */
  async create (data, params) {
    if (await this.checkConnection()) {
      return await this.db.insertOne(Util.getRawObject(data))
    }
  }

  /*
   * Update (replace) DB record with data for ID
   */
  async update (id, data, params) {
    if (await this.checkConnection()) {
      return await this.db.updateOne(Util.getIdQuery(id), Util.getRawObject(data))
    }
  }

  /*
   * Patch (merge) DB record with data for ID
   */
  async patch (id, data, params) {
    if (await this.checkConnection()) {
      return await this.db.updateOne(Util.getIdQuery(id), Util.getRawObject(data))
    }
  }

  /*
   * Remove DB record with ID
   */
  async remove (id, params) {
    if (await this.checkConnection()) {
      return await this.db.removeOne(Util.getIdQuery(id))
    }
  }
}

export default MongoDB
