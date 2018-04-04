import errors from '@feathersjs/errors'
import { UUID_NULL } from './uuid5'

const checkMethod = function () {
  return function (context) {
    const
      { app, params } = context,
      user = params.user,
      nsuuid = app.get('api.uuid.namespace')
    console.log('UUID', nsuuid)
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
