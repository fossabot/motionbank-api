import authentication from '@feathersjs/authentication'
import jwtFeathers, { Verifier } from '@feathersjs/authentication-jwt'
import { ExtractJwt } from 'passport-jwt'
import { app } from '../index'

const
  jwt = require('express-jwt'),
  jwks = require('jwks-rsa')

class CustomVerifier extends Verifier {
  // The verify function has the exact same inputs and
  // return values as a vanilla passport strategy
  verify (req, payload, done) {
    // do your custom stuff. You can call internal Verifier methods
    // and reference this.app and this.options. This method must be implemented.
    console.debug('CustomVerifier:', req, payload)
    // the 'user' variable can be any truthy value
    // the 'payload' is the payload for the JWT access token that is generated after successful authentication
    done(null, {}, payload)
  }
}

/**
 * Authentication Service Factory (express)
 * @returns {Function}
 */
export default function AuthExpress () {
  return function (app) {
    // const authConfig = app.get('authentication')

    /*
    const authConfig = app.get('authentication')
    app.configure(authentication(authConfig))
    const jwtconf = {
      secret: false,
      secretOrKeyProvider: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://motionbank.eu.auth0.com/.well-known/jwks.json'
      }),
      algorithms: ['RS256'],
      jwtFromRequest: ExtractJwt.fromHeader('authorization')
    }
    app.configure(jwtFeathers(jwtconf, (...args) => {
      console.debug('JWT callback:', args)
    }))
    */

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
          return req.headers.authorization.split(' ')[1]
        }
        else if (typeof req.headers.authorization === 'string') {
          return req.headers.authorization
        }
        else if (req.query && req.query.token) {
          return req.query.token
        }
        return null
      }
    })
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
      jwtCheck(req, res, next)
    })
    app.use(function (req, res, next) {
      req.feathers.user = req.user || {}
      next()
    })
    /*
    app.use(function (req, res, next) {
      checkJwt(req, res, function (err) {
        next(Util.getErrorForStatus(err))
      })
    })
    */
  }
}
