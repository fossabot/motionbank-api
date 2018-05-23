'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AuthExpress;
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const jwtAuthz = require('express-jwt-authz')

// import Util from '../base/util'

/**
 * Authentication Service Factory (express)
 * @returns {Function}
 */
function AuthExpress() {
  return function (app) {
    // const authConfig = app.get('authentication')

    // Authentication middleware. When used, the
    // access token must exist and be verified against
    // the Auth0 JSON Web Key Set
    const jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://motionbank.eu.auth0.com/.well-known/jwks.json'
      }),
      audience: 'https://motionbank-api.herokuapp.com',
      issuer: 'https://motionbank.eu.auth0.com/',
      algorithms: ['RS256'],
      credentialsRequired: false,
      getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          return req.headers.authorization.split(' ')[1];
        } else if (typeof req.headers.authorization === 'string') {
          return req.headers.authorization;
        } else if (req.query && req.query.token) {
          return req.query.token;
        }
        return null;
      }
    });
    /*
    const checkJwt = jwt({
      // Dynamically provide a signing key
      // based on the kid in the header and
      // the signing keys provided by the JWKS endpoint.
      secret: jwksRsa.expressJwtSecret(authConfig.jwks),
       // Validate the audience and the issuer.
      audience: 'https://api.motionbank.org',
      issuer: `https://motionbank.eu.auth0.com/`,
      algorithms: ['RS256']
    })
    */

    // const checkScopes = jwtAuthz([ 'retrieve:annotations' ])
    // console.log(checkScopes)

    app.use(function (req, res, next) {
      jwtCheck(req, res, next);
    });
    /*
    app.use(function (req, res, next) {
      checkJwt(req, res, function (err) {
        next(Util.getErrorForStatus(err))
      })
    })
    */
  };
}
module.exports = exports['default'];