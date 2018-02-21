'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _persistence = require('./persistence');

var _persistence2 = _interopRequireDefault(_persistence);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * MongoDB persistence adapter
 */
/* eslint no-return-await: off */
class MongoDB extends _persistence2.default {
  /**
   * Instantiate MongoDB persistence adapter
   * @param options
   */
  constructor(options = {}, idField) {
    _assert2.default.equal(typeof options.url, 'string', 'mongodb: options.url: invalid type');
    if (options.dbName) {
      _assert2.default.equal(typeof options.dbName, 'string', 'mongodb: options.dbName: invalid type');
    }

    options = Object.assign({ name: options.name }, options);
    super(options, null);
    this.idField = idField;
    this._logger = options.logger;
  }

  /**
   * Establish connection to MongoDB server
   * @returns {Promise<void>}
   */
  async connect() {
    const client = await _mongodb2.default.MongoClient.connect(this.options.url),
          database = this.options.dbName ? client.db(this.options.dbName) : client,
          collectionName = (this.options.prefix || '') + this.options.name;
    this._db = database.collection(collectionName);

    this._logger.debug('MongoDB connected to ' + `${this.options.url}/${this.options.dbName} with ` + `collection '${collectionName}'`, 'connect');
  }

  /**
   * Disconnect from MongoDB server
   */
  disconnect() {
    if (this.db) {
      this._logger.debug('MongoDB disconnecting...', 'disconnect');
      this.db.close();
      this._db = null;
    }
  }

  /**
   * Check if connected to MongoDB server.
   * If not, (re-)connect immediately.
   * @returns {Promise<*>}
   */
  async checkConnection() {
    if (!this.db) {
      this._logger.debug(`MongoDB DB: ${JSON.stringify(this.db)}, ` + `reconnecting...`, 'checkConnection');
      await this.connect();
    }
    return this.db;
  }

  /**
   * Find records in DB
   * @param query
   * @param params
   * @returns {Promise<*>}
   */
  async find(query, params) {
    if (await this.checkConnection()) {
      const { q, opts } = _util2.default.parseQuery(query);
      const res = await this.db.find(q).limit(opts.$limit || 0).toArray();
      return res;
    }
  }

  /**
   * Get DB record by ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async get(id, params) {
    if (await this.checkConnection()) {
      const { q } = _util2.default.parseQuery(_util2.default.getIdQuery(id, this.idField));
      const result = await this.db.findOne(q);
      return result;
    }
  }

  /**
   * Create new DB record
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async create(data, params) {
    if (await this.checkConnection()) {
      const result = await this.db.insertOne(_util2.default.getRawObject(data));
      if (result && Array.isArray(result.ops)) {
        if (result.ops.length === 1) {
          return result.ops[0];
        }
        return result.ops;
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
  async update(id, data, params) {
    if (await this.checkConnection()) {
      return await this.db.replaceOne(_util2.default.getIdQuery(id, this.idField), _util2.default.getRawObject(data));
    }
  }

  /**
   * Patch (merge) DB record with data for ID
   * @param id
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async patch(id, data, params) {
    if (await this.checkConnection()) {
      return await this.db.updateOne(_util2.default.getIdQuery(id, this.idField), _util2.default.getRawObject(data));
    }
  }

  /**
   * Remove DB record with ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async remove(id, params) {
    if (await this.checkConnection()) {
      return await this.db.removeOne(_util2.default.getIdQuery(id, this.idField));
    }
  }
}

exports.default = MongoDB;
module.exports = exports['default'];