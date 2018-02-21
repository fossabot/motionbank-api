'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nedb = require('nedb');

var _nedb2 = _interopRequireDefault(_nedb);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _persistence = require('./persistence');

var _persistence2 = _interopRequireDefault(_persistence);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * NeDB persistence adapter
 */
/* eslint no-return-await: off */
class NeDB extends _persistence2.default {
  /**
   * Instantiate NeDB persistence adapter
   * @param options
   */
  constructor(options = {}, idField) {
    // TODO: add assertions
    options = Object.assign({
      autoload: true
    }, options);
    if (options.filename) {
      options.filename = _path2.default.resolve(_path2.default.join(__dirname, '..', '..', '..', `${options.filename}-${options.name}.nedb`));
    }
    super({ name: options.name });
    this._db = new _nedb2.default(options);
    this.idField = idField;
  }

  /**
   * Find records in DB
   * @param query
   * @param params
   * @returns {Promise<*>}
   */
  async find(query, params) {
    const { q, opts } = _util2.default.parseQuery(query);
    return await _util2.default.wrapAsync(this.db, 'find', q, opts);
  }

  /**
   * Get DB record by ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async get(id, params) {
    return await _util2.default.wrapAsync(this.db, 'findOne', _util2.default.getIdQuery(id, this.idField));
  }

  /**
   * Create new DB record
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async create(data, params) {
    const result = await _util2.default.wrapAsync(this.db, 'insert', _util2.default.getRawObject(data));
    return result;
  }

  /**
   * Update (replace) DB record with data for ID
   * @param id
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async update(id, data, params) {
    return await _util2.default.wrapAsync(this.db, 'update', _util2.default.getIdQuery(id, this.idField), _util2.default.getRawObject(data));
  }

  /**
   * Patch (merge) DB record with data for ID
   * @param id
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async patch(id, data, params) {
    return await _util2.default.wrapAsync(this.db, 'update', _util2.default.getIdQuery(id, this.idField), _util2.default.getRawObject(data));
  }

  /**
   * Remove DB record with ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async remove(id, params) {
    return await _util2.default.wrapAsync(this.db, 'remove', _util2.default.getIdQuery(id, this.idField));
  }
}

exports.default = NeDB;
module.exports = exports['default'];