import assert from 'assert'
import SchemaObject from 'schema-object'
import uuid4 from 'uuid/v4'
import buildVars from '../../build-vars'

/*
 * Initialize new Schema
 */
function initSchema (schema) {
  assert.equal(typeof schema, 'object', 'Invalid schema object type')
  assert(Object.keys(schema).length > 0, 'Invalid schema object format')

  const Schema = new SchemaObject(
    schema,
    {
      dotNotation: false,
      strict: false,
      constructors: {
        create (data) {
          this.update(data)
          this[buildVars.idField] = data[buildVars.idField] || uuid4()
        }
      },
      methods: {
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
