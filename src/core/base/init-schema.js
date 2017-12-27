/* eslint-disable no-unused-vars, no-return-await */
import assert from 'assert'
import SchemaObject from 'schema-object'

function initSchema (schema) {
  assert.equal(typeof schema, 'object', 'Invalid schema object type')
  assert(Object.keys(schema).length > 0, 'Invalid schema object format')

  const Schema = new SchemaObject(
    schema,
    {
      dotNotation: false,
      strict: false,
      constructors: {
        async create (data) {
          await this.update(data)
        }
      },
      methods: {
        async update (data) {
          const ctx = this
          await new Promise(resolve => {
            Object.keys(data).map(key => {
              ctx[key] = data[key]
            })
            resolve()
          })
        }
      }
    }
  )
  return Schema
}

export default initSchema
