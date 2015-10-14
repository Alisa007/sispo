/**
 * Passport configuration
 *
 * This is the configuration for your Passport.js setup and where you
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

module.exports.passport = {

  basic: {
    strategy: require('passport-http').BasicStrategy,
    options: {
      clientSecret: process.env.clientSecret || '12bbRlXsFyObUMg3tBq56EgGSwabkjDG43kHsdAkh4s9lFj0'
    }
  },

  facebook: {
    name: 'Facebook',
    protocol: 'oauth2',
    strategy: require('passport-facebook').Strategy,
    options: {
      clientID: '1838960462995866',
      clientSecret: '63011f8e2e317aa61caf733e041d7644',
      scope: ['email'] /* email is necessary for login behavior */
    }
  },

  google: {
    name: 'Google',
    protocol: 'oauth2',
    strategy: require('passport-google-oauth').OAuth2Strategy,
    options: {
      clientID: '452483452860-53bqqilqa0fnqmo26hpdr31hsk9ei48e.apps.googleusercontent.com',
      clientSecret: 'xURF3P03BBiCffhIJKCX4BNq',
      scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
    }
  }

};
