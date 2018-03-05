import assert from 'assert'
import uuidv4 from 'uuid/v4'
import { DateTime } from 'luxon'
import uuidValidate from 'uuid-validate'
import SchemaObject from 'schema-object'

/**
 * Schema factory function
 * @param schema
 * @param options
 */
function initSchema (schema, options = {}) {
  assert.equal(typeof schema, 'object',
    'initSchema: invalid schema type')
  assert(Object.keys(schema).length > 0,
    'initSchema: invalid schema format')

  // FIXME: uuid default is f'cked, refactor
  options.schemaOptions = Object.assign({ idField: 'uuid' }, options.schemaOptions)

  /**
   * Default Schema Handlers
   */
  const schemaHandlers = Object.assign({
    onBeforeValueSet: function (value, key) {
      if (key === options.schemaOptions.idField) {
        return !this[options.schemaOptions.idField] && uuidValidate(value)
      }
      return true
    }
  }, options.handlers || {})

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
      default (data) {
        if (options.created && !data.created) {
          data.created = DateTime.local().toString()
        }
        this.populate(data)
        if (!this[options.schemaOptions.idField]) {
          this[options.schemaOptions.idField] = uuidv4()
        }
        if (data.created) {}
      }
    },
    methods: {
      /**
       * Update instance
       * @param data
       */
      update (data = {}) {
        data[options.schemaOptions.idField] = undefined
        if (options.updated) {
          data.updated = DateTime.local().toString()
        }
        this.populate(data)
        return this
      }
    }
  }, Object.assign(options.schemaOptions || {}, schemaHandlers))

  /**
   * Add optional created and update fields to the Schema
   * @type {{type: StringConstructor, required: boolean}}
   */
  if (options.created) {
    schema.created = { type: String , required: true }
  }
  if (options.updated) {
    schema.updated = { type: String }
  }

  /**
   * Add the ID field to the Schema
   * @type {{type: StringConstructor, required: boolean}}
   */
  if (!options.skipId) {
    schema[options.schemaOptions.idField] = {type: String, required: true}
    schema.id = {type: 'alias', readOnly: true, alias: options.schemaOptions.idField}
  }

  /**
   * Return resource/schema config
   */
  return new SchemaObject(schema, schemaOptions)
}

export default initSchema
