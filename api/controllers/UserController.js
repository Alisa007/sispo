/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
//var passport = require('passport');
var crypto         = require('crypto')
  , util           = require('util')
  , path           = require('path')
  , googleAuth     = require('google-oauth-jwt');


module.exports = {

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

  currentUser:  function(req, res) {
    console.log(req.user);
    res.send(req.user);
  },

  confirmEmail: function(req, res) {
    var user = {
      email    : req.query.email,
      token    : req.query.token
    };

    User.update(user, {
        is_confirmed : true,
        token        : crypto.randomBytes(64).toString('hex')})
      .exec(function(err, user, info) {
        if (err) {
          console.log(err);
          res.serverError();
        } else res.redirect('/users/' + user.id);
      });
  },

  resetPassword: function(req, res) {
    var email  = req.body.email;
    var link   = 'http://localhost:1337/reset_password?email=' + email + '&token=' + token;
  }
};
