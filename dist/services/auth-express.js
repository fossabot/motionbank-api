'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AuthExpress;

var _util = require('../base/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

/**
 * Authentication Service Factory (express)
 * @returns {Function}
 */
function AuthExpress() {
  return function (app) {
    const authConfig = app.get('authentication');

    // Authentication middleware. When used, the
    // access token must exist and be verified against
    // the Auth0 JSON Web Key Set
    const checkJwt = jwt({
      // Dynamically provide a signing key
      // based on the kid in the header and
      // the signing keys provided by the JWKS endpoint.
      secret: jwksRsa.expressJwtSecret(authConfig.jwks),

      // Validate the audience and the issuer.
      audience: 'https://motionbank-api.herokuapp.org',
      issuer: `https://motionbank.eu.auth0.com/`,
      algorithms: ['RS256']
    });

    const checkScopes = jwtAuthz(['retrieve:annotations']);
    console.log(checkScopes);

    app.use(function (req, res, next) {
      checkJwt(req, res, function (err) {
        next(_util2.default.getErrorForStatus(err));
      });
    });
  };
}
module.exports = exports['default'];