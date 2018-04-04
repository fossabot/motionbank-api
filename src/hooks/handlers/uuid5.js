import uuidv5 from 'uuid/v5'
import Debug from 'debug'

const UUID_NULL = '00000000-0000-0000-0000-000000000000'

const getDomainUUIDv5 = function (domain) {
  return uuidv5(domain, uuidv5.DNS)
}

/*
const getUrlUUIDv5 = function (url) {
  return uuidv5(url, uuidv5.URL)
}

const getNameUUIDv5 = function (name) {
  return uuidv5(name, uuidv5.name)
}
*/

const getLocalNamespace = function () {
  return function (context) {
    const { app } = context

    if (!app.has('api.uuid.namespace')) {
      if (app.has('api.uuid.domain')) {
        app.set('api.uuid.namespace', getDomainUUIDv5(app.get('api.uuid.domain')))
        return context
      }

      Debug('mbapi')('WARNING: UUID namespace domain is not configured (api.uuid.domain)')
      if (app.has('api.uuid.root')) {
        app.set('api.uuid.namespace', getDomainUUIDv5(app.get('api.uuid.root')))
        return context
      }

      app.set('api.uuid.namespace', UUID_NULL)
    }

    return context
  }
}

export {
  getLocalNamespace,
  UUID_NULL
}
