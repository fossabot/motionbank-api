/* eslint no-return-await: off */
import assert from 'assert'
import uuidValidate from 'uuid-validate'
import Acl from 'acl'

/**
 * Access Control List implementation
 */
class ACL extends Acl {
  /**
   * Create new ACL
   *
   * @param options
   */
  constructor (options) {
    super(options)
    this._options = options
  }

  /**
   * Get Express middleware
   *
   * @param app
   * @returns {Promise<void>}
   */
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
  async isAllowed (args) {
    return await ACL.isAllowed(args)
  }

  /**
   * Checks if query is allowed
   *
   * @param args
   * @returns {Promise<boolean>}
   */
  static isAllowed (args) {
    const { subject, object, predicates } = args
    ACL.validateParams(subject, object, predicates)
    return Promise.resolve(true)
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

  /**
   * Get default buildVars object
   * @returns {*}
   */
  static get buildVars () {
    return require('../../../build-vars')()
  }
}

export default ACL
