'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Authentication;

var _authentication = require('@feathersjs/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _authenticationJwt = require('@feathersjs/authentication-jwt');

var _authenticationJwt2 = _interopRequireDefault(_authenticationJwt);

var _authenticationLocal = require('@feathersjs/authentication-local');

var _authenticationLocal2 = _interopRequireDefault(_authenticationLocal);

var _authenticationOauth = require('@feathersjs/authentication-oauth2');

var _authenticationOauth2 = _interopRequireDefault(_authenticationOauth);

var _passportAuth = require('passport-auth0');

var _passportAuth2 = _interopRequireDefault(_passportAuth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Authentication Service Factory
 * @returns {Function}
 */
function Authentication() {
  /**
   * Register Service with app
   */
  return function (app) {
    /** Get auth config **/
    const authConfig = app.get('authentication');
    app.configure((0, _authentication2.default)(authConfig));

    /** JWT (JSON Web Token, see: https://jwt.io/) **/
    app.configure((0, _authenticationJwt2.default)());

    /** Local (Email & Password) **/
    app.configure((0, _authenticationLocal2.default)());

    /** OAuth 2 (auth0, see: https://auth0.com) **/
    app.configure((0, _authenticationOauth2.default)(Object.assign({
      name: 'auth0',
      Strategy: _passportAuth2.default
    }, authConfig.auth0)));

    /**
     * The `authentication` service is used to create a JWT.
     * The before `create` hook registers strategies that can be used
     * to create a new valid JWT (e.g. local or oauth2)
     */
    app.service('authentication').hooks({
      before: {
        create: [_authentication2.default.hooks.authenticate(authConfig.strategies)],
        remove: [_authentication2.default.hooks.authenticate('jwt')]
      }
    });
  };
}
module.exports = exports['default'];