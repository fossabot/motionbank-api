/* eslint no-return-await: off */
import assert from 'assert'
import mongodb from 'mongodb'
import logging from 'libmb-base/logging'

import Persistence from 'libmb-base/persistence'
import Util from 'libmb-base/util'

const logger = new logging.Logger(logging.levels.DEBUG)

/**
 * MongoDB persistence adapter
 */
class MongoDB extends Persistence {
  /**
   * Instantiate MongoDB persistence adapter
   * @param options
   */
  constructor (options = {}, idField) {
    assert.equal(typeof options.url, 'string',
      'mongodb: options.url: invalid type')
    assert.equal(typeof options.dbName, 'string',
      'mongodb: options.dbName: invalid type')

    options = Object.assign({ name: options.name }, options)
    super(options, null)
    this.idField = idField
  }

  /**
   * Establish connection to MongoDB server
   * @returns {Promise<void>}
   */
  async connect () {
    const
      client = await mongodb.MongoClient.connect(this.options.url),
      database = client.db(this.options.dbName),
      collectionName = (this.options.prefix || '') + this.options.name
    this._db = database.collection(collectionName)

    logger.debug('MongoDB connected to ' +
      `${this.options.url}/${this.options.dbName} with ` +
      `collection '${collectionName}'`, 'connect')
  }

  /**
   * Disconnect from MongoDB server
   */
  disconnect () {
    if (this.db) {
      logger.debug('MongoDB disconnecting...', 'disconnect')
      this.db.close()
      this._db = null
    }
  }

  /**
   * Check if connected to MongoDB server.
   * If not, (re-)connect immediately.
   * @returns {Promise<*>}
   */
  async checkConnection () {
    if (!this.db) {
      logger.debug(`MongoDB DB: ${JSON.stringify(this.db)}, ` +
        `reconnecting...`, 'checkConnection')
      await this.connect()
    }
    return (this.db)
  }

  /**
   * Find records in DB
   * @param query
   * @param params
   * @returns {Promise<*>}
   */
  async find (query, params) {
    if (await this.checkConnection()) {
      const { q, opts } = Util.parseQuery(query)
      const res = await this.db.find(q).limit(opts.$limit || 0).toArray()
      return res
    }
  }

  /**
   * Get DB record by ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async get (id, params) {
    if (await this.checkConnection()) {
      const { q } = Util.parseQuery(Util.getIdQuery(id, this.idField))
      const result = await this.db.findOne(q)
      return result
    }
  }

  /**
   * Create new DB record
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async create (data, params) {
    if (await this.checkConnection()) {
      const result = await this.db.insertOne(Util.getRawObject(data))
      if (result && Array.isArray(result.ops)) {
        if (result.ops.length === 1) {
          return result.ops[0]
        }
        return result.ops
      }
    }
  }

  /**
   * Update (replace) DB record with data for ID
   * @param id
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async update (id, data, params) {
    if (await this.checkConnection()) {
      return await this.db.replaceOne(Util.getIdQuery(id, this.idField),
        Util.getRawObject(data))
    }
  }

  /**
   * Patch (merge) DB record with data for ID
   * @param id
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async patch (id, data, params) {
    if (await this.checkConnection()) {
      return await this.db.updateOne(Util.getIdQuery(id, this.idField),
        Util.getRawObject(data))
    }
  }

  /**
   * Remove DB record with ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async remove (id, params) {
    if (await this.checkConnection()) {
      return await this.db.removeOne(Util.getIdQuery(id, this.idField))
    }
  }
}

export default MongoDB
