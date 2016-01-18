/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var googleAuth     = require('google-oauth-jwt');

module.exports = {

  /**
   * Get google analytics token
   */

  accessAnalytics: function(req, res) {
    var authOptions = {
      email: '452483452860-stt1at87u071ptnnu62c457bnm8b5ofr@developer.gserviceaccount.com',
      keyFile: '/Users/alisabelousova/WebstormProjects/sispo/sispo/assets/ga-key.pem',
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    };

    googleAuth.authenticate(authOptions, function (err, token) {
      if (err) {
        res.serverError();
      } else res.send({token: token});
    });
  },

  /**
   * Get current user
   */

  currentUser:  function(req, res) {
    res.send(req.user);
  }
};
