import assert from 'assert'
import SchemaObject from 'schema-object'
import uuid4 from 'uuid/v4'
import buildVars from '../../build-vars'

/**
 * Schema factory function
 * @param schema
 * @returns {{new(values?: any): (any & "schema-object".SchemaObjectInstance<any>)}}
 */
function initSchema (schema) {
  assert.equal(typeof schema, 'object', 'Invalid schema object type')
  assert(Object.keys(schema).length > 0, 'Invalid schema object format')

  /**
   * Create a new Schema Object Constructor from options
   * @type {{new(values?: any): (any & "schema-object".SchemaObjectInstance<any>)}}
   */
  const Schema = new SchemaObject(
    schema,
    {
      // TODO: default settings?
      dotNotation: false,
      strict: false,
      constructors: {
        /**
         * Constructor with payload
         * @constructor
         * @param data
         */
        create (data) {
          this.update(data)
          this[buildVars.idField] = data[buildVars.idField] || uuid4()
        }
      },
      methods: {
        /**
         * Update instance props from data
         * @param data
         */
        update (data = {}) {
          const ctx = this
          Object.keys(data).map(key => {
            if (key !== buildVars.idField) {
              ctx[key] = data[key]
            }
          })
        }
      }
    }
  )
  return Schema
}

export default initSchema
