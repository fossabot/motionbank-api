import authentication from '@feathersjs/authentication'
import jwt from '@feathersjs/authentication-jwt'
import local from '@feathersjs/authentication-local'
import oauth2 from '@feathersjs/authentication-oauth2'
import Auth0Strategy from 'passport-auth0'

/**
 * Authentication Service Factory
 * @returns {Function}
 */
export default function () {
  /**
   * Register Service with app
   */
  return function (app) {
    /** Get auth config **/
    const config = app.get('authentication')
    app.configure(authentication(config))

    /**
     * JWT (JSON Web Token)
     * see: https://jwt.io/
     */
    app.configure(jwt())

    /**
     * Local (Email & Password)
     */
    app.configure(local())

    /**
     * OAuth 2 (auth0)
     * see: https://auth0.com/
     */
    app.configure(oauth2(Object.assign({
      name: 'auth0',
      Strategy: Auth0Strategy
    }, config.auth0)))

    /**
     * The `authentication` service is used to create a JWT.
     * The before `create` hook registers strategies that can be used
     * to create a new valid JWT (e.g. local or oauth2)
     */
    app.service('authentication').hooks({
      before: {
        create: [
          authentication.hooks.authenticate(config.strategies)
        ],
        remove: [
          authentication.hooks.authenticate('jwt')
        ]
      }
    })
  }
}
