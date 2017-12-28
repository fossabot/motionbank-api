/* eslint no-return-await: off */
import assert from 'assert'
import uuidValidate from 'uuid-validate'
import Acl from 'acl'

//
// Access Control List implementation
//
class ACL extends Acl {
  constructor (options) {
    super(options)
    this._options = options
  }

  //
  // Express middleware
  //
  async middleware (app) {
    const acl = async (req, res, next) => {
      const
        uuid = req.user && uuidValidate(req.user[ACL.buildVars.idField])
          ? req.user[ACL.buildVars.idField] : ACL.buildVars.uuidUnknown,
        query = {
          subject: uuid,
          // TODO: href? path?
          object: req.uri.href,
          predicates: req.method
        },
        allowed = await ACL.isAllowed(query)
      if (allowed) {
        return next()
      }
      // TODO: add correct error
      throw new Error('forbidden')
    }
    app.use(acl)
  }

  //
  // Query methods
  //
  async allow (args) {
    const { subject, object, predicates } = args
    ACL.validateParams(subject, object, predicates)
    await super.allow(subject, object, predicates)
  }
  async isAllowed (args) {
    return await ACL.isAllowed(args)
  }

  //
  // Statics
  //
  static isAllowed (args) {
    const { subject, object, predicates } = args
    ACL.validateParams(subject, object, predicates)
    return Promise.resolve(true)
  }
  static validateParams (subject, object, predicates) {
    assert(typeof subject === 'string',
      'ACL args: subject must be valid uuid')
    assert(typeof object === 'string',
      'ACL args: object must be string')
    assert(typeof predicates === 'string' || Array.isArray(predicates),
      'ACL args: predicates must be string or array of strings')

    if (Array.isArray(predicates)) {
      predicates.forEach(predicate => {
        assert(typeof predicate === 'string',
          'ACL args: predicates must be string or array of strings')
      })
    }
  }

  //
  // Getters
  //
  static get buildVars () {
    return require('../../build-vars')()
  }
}

export default ACL
