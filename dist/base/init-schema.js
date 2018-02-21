'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

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

  options.schemaOptions = Object.assign({ idField: 'id' }, options.schemaOptions);

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
    dotNotation: true,
    strict: true,
    constructors: {
      /**
       * Default Constructor
       * @constructor
       * @param data
       * @param id
       */
      default(data) {
        this.populate(data);
        if (!this[options.schemaOptions.idField]) {
          this[options.schemaOptions.idField] = _uuid2.default.v4();
        }
      }
    },
    methods: {
      /**
       * Update instance
       * @param data
       */
      update(data = {}) {
        data[options.schemaOptions.idField] = undefined;
        this.populate(data);
        return this;
      }
    }
  }, Object.assign(options.schemaOptions || {}, schemaHandlers));

  /**
   * Add the ID field to the Schema
   * @type {{type: StringConstructor, required: boolean}}
   */
  schema[options.schemaOptions.idField] = { type: String, required: true };
  schema.id = { type: String, readOnly: true, alias: options.schemaOptions.idField

    /**
     * Return resource/schema config
     */
  };return new _schemaObject2.default(schema, schemaOptions);
}

exports.default = initSchema;
module.exports = exports['default'];