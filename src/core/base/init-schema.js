import assert from 'assert'
import uuid from 'uuid'
import uuidValidate from 'uuid-validate'
import buildVars from '../../build-vars'
import SchemaObject from 'schema-object'

const idField = buildVars().idField

/**
 * Schema factory function
 * @param schema
 * @param options
 */
function initSchema (schema, options = {}) {
  assert.equal(typeof schema, 'object', 'initSchema: invalid schema type')
  assert(Object.keys(schema).length > 0, 'initSchema: invalid schema format')

  /**
   * Default Schema Handlers
   */
  const schemaHandlers = Object.assign({
    onBeforeValueSet: function (value, key) {
      if (key === idField) {
        return !this[idField] && uuidValidate(value)
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
    dotNotation: true,
    strict: true,
    constructors: {
      /**
       * Default Constructor
       * @constructor
       * @param data
       * @param id
       */
      default (data) {
        this.populate(data)
        if (!this[idField]) {
          this[idField] = uuid.v4()
        }
      }
    },
    methods: {
      /**
       * Update instance
       * @param data
       */
      update (data = {}) {
        data[idField] = undefined
        this.populate(data)
        return this
      }
    }
  }, Object.assign(options.schemaOptions || {}, schemaHandlers))

  /**
   * Add the ID field to the Schema
   * @type {{type: StringConstructor, required: boolean}}
   */
  schema[buildVars().idField] = { type: String, required: true }
  schema.id = { type: String, readOnly: true, alias: buildVars().idField }

  /**
   * Return resource/schema config
   */
  return new SchemaObject(schema, schemaOptions)
}

export default initSchema
