'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _uuidValidate = require('uuid-validate');

var _uuidValidate2 = _interopRequireDefault(_uuidValidate);

var _errors = require('@feathersjs/errors');

var _errors2 = _interopRequireDefault(_errors);

var _acl = require('acl');

var _acl2 = _interopRequireDefault(_acl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: remove this!
/* eslint no-return-await: off */
let _buildVars;

/**
 * Access Control List implementation
 */
class ACL extends _acl2.default {
  /**
   * Create new ACL
   *
   * @param options
   */
  constructor(options, buildVars) {
    super(options);
    this._options = options;
    _buildVars = buildVars;
  }

  /**
   * Get Express middleware
   *
   * @param app
   * @returns {Promise<void>}
   */
  middleware(app) {
    const acl = (req, res, next) => {
      app.passport.verifyJWT(req.headers.authorization, {
        secret: app.get('authentication').secret
      }).then(jwt => {
        const uuid = jwt && (0, _uuidValidate2.default)(jwt.userId) ? jwt.userId : _buildVars.uuidUnknown,
              query = {
          subject: uuid,
          // TODO: href? path?
          object: req.uri.href,
          predicates: req.method
        };
        return ACL.isAllowed(query);
      }).then(allowed => {
        if (allowed) {
          next();
        }
        // TODO: add correct error
        next(new _errors2.default.Forbidden());
      });
    };
    app.use(acl);
  }

  /**
   * Update ACL with allow statement
   *
   * @param args
   * @returns {Promise<void>}
   */
  async allow(args) {
    const { subject, object, predicates } = args;
    ACL.validateParams(subject, object, predicates);
    await super.allow(subject, object, predicates);
  }

  /**
   * Checks if query is allowed
   *
   * @param args
   * @returns {Promise<boolean>}
   */
  static async isAllowed(args) {
    return await ACL._isAllowed(args);
  }

  /**
   * Checks if query is allowed
   *
   * @param args
   * @returns boolean
   */
  static _isAllowed(args) {
    const { subject, object, predicates } = args;
    ACL.validateParams(subject, object, predicates);
    return true;
  }

  /**
   * Validates argument form
   *
   * @param subject
   * @param object
   * @param predicates
   */
  static validateParams(subject, object, predicates) {
    (0, _assert2.default)(typeof subject === 'string', 'ACL args: subject must be valid uuid');
    (0, _assert2.default)(typeof object === 'string', 'ACL args: object must be string');
    (0, _assert2.default)(typeof predicates === 'string' || Array.isArray(predicates), 'ACL args: predicates must be string or array of strings');

    if (Array.isArray(predicates)) {
      predicates.forEach(predicate => {
        (0, _assert2.default)(typeof predicate === 'string', 'ACL args: predicates must be string or array of strings');
      });
    }
  }
}

exports.default = ACL;
module.exports = exports['default'];