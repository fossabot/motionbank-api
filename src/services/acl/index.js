/* eslint no-return-await: off */
import assert from 'assert'
import uuidValidate from 'uuid-validate'
import errors from '@feathersjs/errors'
import Acl from 'acl'

// TODO: remove this!
let _buildVars

/**
 * Access Control List implementation
 */
class ACL extends Acl {
  /**
   * Create new ACL
   *
   * @param options
   */
  constructor (options, buildVars) {
    super(options)
    this._options = options
    _buildVars = buildVars
  }

  /**
   * Get Express middleware
   *
   * @param app
   * @returns {Promise<void>}
   */
  middleware (app) {
    const acl = (req, res, next) => {
      app.passport.verifyJWT(req.headers.authorization, {
        secret: app.get('authentication').secret,
      }).then(jwt => {
        const uuid = jwt && uuidValidate(jwt.userId)
          ? jwt.userId : _buildVars.uuidUnknown,
          query = {
            subject: uuid,
            // TODO: href? path?
            object: req.uri.href,
            predicates: req.method
          }
        return ACL.isAllowed(query)
      }).then(allowed => {
        if (allowed) {
          next()
        }
        // TODO: add correct error
        next(new errors.Forbidden())
      })
    }
    app.use(acl)
  }

  /**
   * Update ACL with allow statement
   *
   * @param args
   * @returns {Promise<void>}
   */
  async allow (args) {
    const { subject, object, predicates } = args
    ACL.validateParams(subject, object, predicates)
    await super.allow(subject, object, predicates)
  }

  /**
   * Checks if query is allowed
   *
   * @param args
   * @returns {Promise<boolean>}
   */
  static async isAllowed (args) {
    return await ACL._isAllowed(args)
  }

  /**
   * Checks if query is allowed
   *
   * @param args
   * @returns boolean
   */
  static _isAllowed (args) {
    const { subject, object, predicates } = args
    ACL.validateParams(subject, object, predicates)
    return true
  }

  /**
   * Validates argument form
   *
   * @param subject
   * @param object
   * @param predicates
   */
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
}

export default ACL
