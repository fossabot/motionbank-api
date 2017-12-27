import assert from 'assert'
import SchemaObject from 'schema-object'

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
        }
      },
      methods: {
        update (data = {}) {
          const ctx = this
          Object.keys(data).map(key => {
            ctx[key] = data[key]
          })
        }
      }
    }
  )
  return Schema
}

export default initSchema
