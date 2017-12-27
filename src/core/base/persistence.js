/* eslint-disable no-unused-vars, no-return-await */
class Persistence {
  constructor (options) {
    this.options = options || {}
  }

  async find (params) {
    console.log('WARNING: dummy persistence find')
    return [
      { id: 1, text: 'A new message with ID: 1!' },
      { id: 2, text: 'A new message with ID: 2!' }
    ]
  }

  async get (id, params) {
    console.log('WARNING: dummy persistence get')
    return {
      id, text: `A new message with ID: ${id}!`
    }
  }

  async create (data, params) {
    console.log('WARNING: dummy persistence create')
    if (Array.isArray(data)) {
      await Promise.all(data.map(current => this.create(current)))
    }
    return data
  }

  async update (id, data, params) {
    console.log('WARNING: dummy persistence update')
    return Promise.resolve(data)
  }

  async patch (id, data, params) {
    console.log('WARNING: dummy persistence patch')
    return Promise.resolve(data)
  }

  async remove (id, params) {
    console.log('WARNING: dummy persistence remove')
    return Promise.resolve({ id })
  }

  get db () {
    return this.options.db
  }
}

export default Persistence
