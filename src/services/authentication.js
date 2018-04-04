import authentication from '@feathersjs/authentication'
import jwt, { Verifier } from '@feathersjs/authentication-jwt'
import local from '@feathersjs/authentication-local'
import oauth2 from '@feathersjs/authentication-oauth2'
import assignDeep from 'assign-deep'
import passportJwt from 'passport-jwt'
// import passportAuth0 from 'passport-auth0'

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
 * Authentication Service Factory
 * @returns {Function}
 */
export default function Authentication () {
  /**
   * Register Service with app
   */
  return function (app) {
    /** Get auth config **/
    const authConfig = app.get('authentication')
    app.configure(authentication(authConfig))

    /** JWT (JSON Web Token, see: https://jwt.io/) **/
    app.configure(jwt({
      Verifier: CustomVerifier
    }, (...args) => {
      console.debug('JWT callback:', args)
    }))

    /**
     * Local (Email & Password)
     **/
    app.configure(local())

    /** OAuth 2 (auth0, see: https://auth0.com) **/
    const
      { auth0 } = authConfig,
      auth0Config = assignDeep({
        handler: function (...args) {
          console.log('OAuth2', args)
        },
        Verifier: CustomVerifier,
        jwtFromRequest: [
          passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
          passportJwt.ExtractJwt.fromAuthHeaderWithScheme('jwt')
        ]
      }, auth0)
    auth0Config.Strategy = passportJwt.Strategy // passportAuth0.Strategy
    app.configure(oauth2(auth0Config), (...args) => {
      console.debug('Oauth2 callback:', args)
    })

    /**
     * The `authentication` service is used to create a JWT.
     * The before `create` hook registers strategies that can be used
     * to create a new valid JWT (e.g. local or oauth2)
     */
    app.service('authentication').hooks({
      before: {
        create: [
          authentication.hooks.authenticate(authConfig.strategies)
        ],
        remove: [
          authentication.hooks.authenticate('jwt')
        ]
      }
    })
  }
}
