'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Service base class
 */
/* eslint no-return-await: off */
class Service {
  /**
   * Create a new Service instance
   * @param options
   * @param persistence
   */
  constructor(options, persistence) {
    (0, _assert2.default)(options && persistence, 'service: invalid arguments');
    _assert2.default.equal(typeof options.Schema, 'function', 'service: invalid schema type');
    _assert2.default.equal(typeof persistence.Constructor, 'function', 'service: invalid persistence constructor');

    this._options = options;
    this._persistence = persistence;
    this._Model = this.options.Schema;
    this._client = new this.persistence.Constructor(this._persistence.options, this._options.schemaOptions.idField);
  }

  /**
   * Find resources
   * @param params
   * @returns {Promise<void>}
   */
  async find(params) {
    const results = await this.client.find(params.query, params);
    return results;
  }

  /**
   * Get resource by ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async get(id, params) {
    const result = await this.client.get(id, params);
    if (result) {
      const instance = new this.ModelConstructor(result, `${id}`);
      return _util2.default.formatServiceResult(instance, false);
    }
  }

  /**
   * Create resource(s)
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async create(data, params) {
    const ctx = this;
    if (Array.isArray(data)) {
      const results = await Promise.all(data.map(entry => {
        return ctx.create(entry, params);
      }));
      return results;
    }
    // TODO: allow for full array inserts instead just single requests
    const instance = new this.ModelConstructor(data),
          result = await this.client.create(instance, params);
    instance.update(result);
    return _util2.default.formatServiceResult(instance, false);
  }

  /**
   * Update (replace) resource by ID with data
   * @param id
   * @param data
   * @param params
   * @returns {Promise<undefined>}
   */
  async update(id, data, params) {
    let result = await this.get(id);
    if (result) {
      // TODO: transactions anyone?!
      let instance = new this.ModelConstructor(data, id);
      result = await this.client.update(id, instance, params);
      instance = new this.ModelConstructor(result, id);
      return _util2.default.formatServiceResult(instance, false);
    }
  }

  /**
   * Update (merge) resource by ID with data
   * @param id
   * @param data
   * @param params
   * @returns {Promise<*>}
   */
  async patch(id, data, params) {
    let instance = await this.get(id);
    if (instance) {
      instance.update(data);
      await this.client.update(id, instance, params);
      return _util2.default.formatServiceResult(instance, false);
    }
  }

  /**
   * Remove resource by ID
   * @param id
   * @param params
   * @returns {Promise<*>}
   */
  async remove(id, params) {
    return _util2.default.formatServiceResult((await this.client.remove(id, params)), false);
  }

  /**
   * Get persistence configuration
   * @returns {*}
   */
  get persistence() {
    return this._persistence;
  }

  /**
   * Get persistence client instance
   * @returns {*}
   */
  get client() {
    return this._client;
  }

  /**
   * Get service options
   * @returns {*}z7
   */
  get options() {
    return this._options;
  }

  /**
   * Get name of the ID field
   * @returns {*}
   */
  get id() {
    return this._options.schemaOptions.idField;
  }

  /**
   * Get Schema model constructor
   * @returns {*}
   * @constructor
   */
  get ModelConstructor() {
    return this._Model;
  }
}

exports.default = Service;
module.exports = exports['default'];