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

var _buildVars2 = require('../../../build-vars');

var _buildVars3 = _interopRequireDefault(_buildVars2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: remove this!
let _buildVars;

/**
 * Access Control List implementation
 */
/* eslint no-return-await: off */
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
   * ACL hook function
   * @returns {Object}
   */
  static async hook(context) {
    const { params } = context;
    const query = {
      subject: params.userId || (0, _buildVars3.default)().uuidUnknown,
      // TODO: href? path?
      object: context.id || context.path,
      predicates: context.method
    };
    const allowed = await context.app.get('acl').isAllowed(query);
    return context;
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
  async isAllowed(args) {
    return await this._isAllowed(args);
  }

  /**
   * Checks if query is allowed
   *
   * @param args
   * @returns boolean
   */
  _isAllowed(args) {
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