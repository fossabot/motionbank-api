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

var _assignDeep = require('assign-deep');

var _assignDeep2 = _interopRequireDefault(_assignDeep);

var _passportJwt = require('passport-jwt');

var _passportJwt2 = _interopRequireDefault(_passportJwt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import passportAuth0 from 'passport-auth0'

class CustomVerifier extends _authenticationJwt.Verifier {
  // The verify function has the exact same inputs and
  // return values as a vanilla passport strategy
  verify(req, payload, done) {
    // do your custom stuff. You can call internal Verifier methods
    // and reference this.app and this.options. This method must be implemented.
    console.debug('CustomVerifier:', req, payload);
    // the 'user' variable can be any truthy value
    // the 'payload' is the payload for the JWT access token that is generated after successful authentication
    done(null, {}, payload);
  }
}

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
    app.configure((0, _authenticationJwt2.default)({
      Verifier: CustomVerifier
    }, (...args) => {
      console.debug('JWT callback:', args);
    }));

    /**
     * Local (Email & Password)
     **/
    app.configure((0, _authenticationLocal2.default)());

    /** OAuth 2 (auth0, see: https://auth0.com) **/
    const { auth0 } = authConfig,
          auth0Config = (0, _assignDeep2.default)({
      handler: function (...args) {
        console.log('OAuth2', args);
      },
      Verifier: CustomVerifier,
      jwtFromRequest: [_passportJwt2.default.ExtractJwt.fromAuthHeaderAsBearerToken(), _passportJwt2.default.ExtractJwt.fromAuthHeaderWithScheme('jwt')]
    }, auth0);
    auth0Config.Strategy = _passportJwt2.default.Strategy; // passportAuth0.Strategy
    app.configure((0, _authenticationOauth2.default)(auth0Config), (...args) => {
      console.debug('Oauth2 callback:', args);
    });

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