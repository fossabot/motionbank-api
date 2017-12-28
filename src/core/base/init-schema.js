import assert from 'assert'
import uuid4 from 'uuid/v4'
import uuidValidate from 'uuid-validate'
import buildVars from '../../build-vars'
import SchemaObject from 'schema-object'

/**
 * Schema factory function
 * @param schema
 * @returns SchemaObjectInstance<any>
 */
function initSchema (schema, options = {}) {
  assert.equal(typeof schema, 'object', 'initSchema: invalid schema type')
  assert(Object.keys(schema).length > 0, 'initSchema: invalid schema format')

  /**
   * Default Schema Handlers
   */
  const schemaHandlers = Object.assign({
    onBeforeValueSet: function (value, key) {
      if (key === buildVars.idField) {
        if (uuidValidate.version(this[key])) {
          return false
        }
        this[key] = uuid4()
        return false
      }
    }
  }, options.handlers || {})

  /**
   * Default Options to be set on the Schema
   */
  const schemaOptions = Object.assign({
    setUndefined: false,
    preserveNull: true,
    dotNotation: true,
    strict: true
  }, Object.assign(options.schemaOptions || {}, schemaHandlers))

  schema = Object.assign(schema, {
    constructors: {
      /**
       * Default Constructor
       * @constructor
       * @param data
       */
      default (data) {
        this.super(data)
      }
    },
    methods: {
      /**
       * Update instance
       * @param data
       */
      update (data = {}) {
        this.populate(data)
      },
      /**
       * Clear instance
       * @param data
       */
      clear () {
        this.clear()
      }
    }
  })
  schema[buildVars.idField] = {type: String, required: true, readOnly: true}

  /**
   * Return resource/schema config
   * @type SchemaObject
   */
  return new SchemaObject(schema, schemaOptions)
}

export default initSchema
