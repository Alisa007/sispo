var validator      = require('validator')
  , crypto         = require('crypto')
  , util           = require('util')
  , nodemailer     = require('nodemailer')
  , geoip          = require('geoip-lite')
  , path           = require('path')
  , templatesDir   = path.resolve(__dirname, '../../..', 'assets', 'templates', 'email')
  , emailTemplates = require('email-templates');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alisabelousova007@gmail.com',
    pass: 'anapa007'
  }
});



exports.register = function (req, res, next) {

};

exports.connect = function (req, res, next) {
  var user     = req.user
    , password = req.param('password');

  Passport.findOne({
    protocol : 'basic'
  , user     : user.id
  }, function (err, passport) {
    if (err) {
      return next(err);
    }

    if (!passport) {
      Passport.create({
        protocol : 'basic'
      , password : password
      , user     : user.id
      }, function (err, passport) {
        next(err, user);
      });
    }
    else {
      next(null, user);
    }
  });
};

/**
 * Validate a login request
 *
 * Looks up a user using the supplied identifier (email or username) and then
 * attempts to find a local Passport associated with the user. If a Passport is
 * found, its password is checked against the password supplied in the form.
 *
 * @param {Object}   req
 * @param {string}   identifier
 * @param {string}   password
 * @param {Function} next
 */
exports.login = function (req, identifier, password, next) {

};
