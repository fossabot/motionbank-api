import buildVars from '../../build-vars'
import errors from '@feathersjs/errors'

const checkMethod = function () {
  return function (context) {
    const
      { params } = context,
      user = params.user
    // TODO: add configurable id field
    if ((!params.authenticated || !user || !user.uuid)) {
      if (['get', 'find'].indexOf(context.method) === -1) {
        throw new errors.MethodNotAllowed()
      }
      else {
        params.user = { uuid: buildVars().uuidUnknown }
      }
    }
  }
}

export default checkMethod
