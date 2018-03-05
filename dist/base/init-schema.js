'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _luxon = require('luxon');

var _uuidValidate = require('uuid-validate');

var _uuidValidate2 = _interopRequireDefault(_uuidValidate);

var _schemaObject = require('schema-object');

var _schemaObject2 = _interopRequireDefault(_schemaObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Schema factory function
 * @param schema
 * @param options
 */
function initSchema(schema, options = {}) {
  _assert2.default.equal(typeof schema, 'object', 'initSchema: invalid schema type');
  (0, _assert2.default)(Object.keys(schema).length > 0, 'initSchema: invalid schema format');

  // FIXME: uuid default is f'cked, refactor
  options.schemaOptions = Object.assign({ idField: 'uuid' }, options.schemaOptions);

  /**
   * Default Schema Handlers
   */
  const schemaHandlers = Object.assign({
    onBeforeValueSet: function (value, key) {
      if (key === options.schemaOptions.idField) {
        return !this[options.schemaOptions.idField] && (0, _uuidValidate2.default)(value);
      }
      return true;
    }
  }, options.handlers || {});

  /**
   * Default Options and methods to be set on the Schema
   */
  const schemaOptions = Object.assign({
    setUndefined: false,
    preserveNull: true,
    dotNotation: false,
    strict: true,
    constructors: {
      /**
       * Default Constructor
       * @constructor
       * @param data
       * @param id
       */
      default(data) {
        if (options.created && !data.created) {
          data.created = _luxon.DateTime.local().toString();
        }
        this.populate(data);
        if (!this[options.schemaOptions.idField]) {
          this[options.schemaOptions.idField] = (0, _v2.default)();
        }
        if (data.created) {}
      }
    },
    methods: {
      /**
       * Update instance
       * @param data
       */
      update(data = {}) {
        data[options.schemaOptions.idField] = undefined;
        if (options.updated) {
          data.updated = _luxon.DateTime.local().toString();
        }
        this.populate(data);
        return this;
      }
    }
  }, Object.assign(options.schemaOptions || {}, schemaHandlers));

  /**
   * Add optional created and update fields to the Schema
   * @type {{type: StringConstructor, required: boolean}}
   */
  if (options.created) {
    schema.created = { type: String, required: true };
  }
  if (options.updated) {
    schema.updated = { type: String };
  }

  /**
   * Add the ID field to the Schema
   * @type {{type: StringConstructor, required: boolean}}
   */
  if (!options.skipId) {
    schema[options.schemaOptions.idField] = { type: String, required: true };
    schema.id = { type: 'alias', readOnly: true, alias: options.schemaOptions.idField };
  }

  /**
   * Return resource/schema config
   */
  return new _schemaObject2.default(schema, schemaOptions);
}

exports.default = initSchema;
module.exports = exports['default'];