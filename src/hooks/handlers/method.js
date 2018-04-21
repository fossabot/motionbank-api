import errors from '@feathersjs/errors'
import { UUID_NULL } from './uuid5'

const checkMethod = function () {
  return function (context) {
    let user
    const
      { app, params } = context,
      nsuuid = app.get('api.uuid.namespace')

    try {
      user = { uuid: params.payload.userId }
    }
    catch (e) {
      user = params.user
    }

    console.log('Namespace UUID', nsuuid)
    // TODO: add configurable id field
    if ((!params.authenticated || !user || !user.uuid)) {
      if (['get', 'find'].indexOf(context.method) === -1) {
        throw new errors.MethodNotAllowed()
      }
      else {
        params.user = { uuid: UUID_NULL }
      }
    }
  }
}

export default checkMethod
