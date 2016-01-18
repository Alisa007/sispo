/**
 * Created by alisabelousova on 6/5/15.
 */
// testing is a risk factor - what if not/poorly done
var jwt            = require('jwt-simple')
  , moment         = require('moment')
  ,crypto          = require('crypto')
  , path           = require('path')
  , request        = require('request')
  , templatesDir   = path.resolve(__dirname, '../..', 'assets', 'templates', 'email')
  , emailTemplates = require('email-templates')
  , nodemailer     = require('nodemailer')
  , ip             = require('ip')
  , geoip          = require('geoip-lite')
  , code = require('country-code-lookup');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alisabelousova007@gmail.com',
    pass: 'anapa007'
  }
});

module.exports = {
  getLocation: function (req, res, user) {
    var i = ip.address();

    if (ip.isPrivate(i)) {
      i = '14.192.213.8';
    }

    var geo = geoip.lookup(i);
    geo.countryFull = code.byIso(geo.country).country;

    User.update({
      id : user.id
    }, {
      location: geo
    }).exec();
  },

  createJWT: function (user) {
    var payload = {
      sub: user.id,
      iat: moment().unix(),
      exp: moment().add(14, 'days').unix()
    };

    return jwt.encode(payload, sails.config.passport.basic.options.clientSecret );
  },

  authProvider: function(req, res, email, isVerified, provider, accessToken) {
    User.findOne({ email: email }, function(err, user) {
      if (err || !user) {
        User.create({
          email         : email
          , isVerified  : isVerified
        }).exec(function (err, user) {
          Passport.create({
            provider      : provider
            , user        : user.id
            , accessToken : accessToken
          }).exec(function (err, passport) {
            return res.send({
              token: AuthService.createJWT(user),
              user: user
            });
          });
        })
      } else {

        AuthService.getLocation(req, res, user);

        Passport.findOne({
          provider      : 'google',
          user: user.id
        }, function(err, passport) {
          if (err || !passport) {
            Passport.create({
              provider      : 'google'
              , protocol    :'oauth2'
              , user        : user.id
              , accessToken : accessToken
            }).exec(function (err, passport) {
              if (err || !passport) {
                return console.log(err);
              }

              return res.json({
                token: AuthService.createJWT(user),
                user: user
              });
            });
          } else {
            return res.json({
              token: AuthService.createJWT(user),
              user: user
            });
          }
        });
      }
    });
  },

  authGoogle: function(req, res) {
    var params = {
      code          : req.body.code,
      client_id     : req.body.clientId,
      redirect_uri  : req.body.redirectUri,
      client_secret : sails.config.passport.google.options.clientSecret,
      grant_type    : 'authorization_code'
    };

    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token'
      , apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
      var accessToken = token.access_token;
      var headers = { Authorization: 'Bearer ' + accessToken };

      // Step 2. Retrieve profile information about the current user.
      request.get({ url: apiUrl, headers: headers, json: true }, function(err, response, profile) {
        AuthService.authProvider(req, res, profile.email, profile.email_verified, 'google', accessToken);
      });
    });
  },

  authFacebook: function(req, res) {
    console.log(req.body);

    var params = {
      code          : req.body.code,
      client_id     : req.body.clientId,
      redirect_uri  : req.body.redirectUri,
      client_secret : sails.config.passport.facebook.options.clientSecret
    };

    var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token'
      , apiUrl = 'https://graph.facebook.com/v2.3/me';

    // Step 1. Exchange authorization code for access token.
    request.get({
      url: accessTokenUrl,
      qs: params,
      json: true
    }, function(err, response, accessToken) {

      if (response.statusCode !== 200) {
        return res.status(500).send({ message: accessToken.error.message });
      }

      // Step 2. Retrieve profile information about the current user.
      request.get({
        url: apiUrl,
        qs: accessToken,
        json: true
      }, function(err, response, profile) {
        if (response.statusCode !== 200) {
          return res.status(500).send({ message: profile.error.message });
        }
        AuthService.authProvider(req, res, profile.email, profile.verified, 'facebook', accessToken.access_token)
      });
    });
  },

  recover: function(req, res) {
    var email    = req.body.email;

    if (!email) {
      return res.status(400).send('Email or password not specified');
    }

    User.update({
      email: email
    }, {
      recoverToken: crypto.randomBytes(48).toString('hex')
    }).exec(function (err, users) {
      if (err || !users) {
        return res.status(400).send({message: 'Please, check your credentials'});
      } else {
        var user = users[0]
          , link = 'http://localhost:1337/recover?email=' + user.email + '&token=' + user.recoverToken;

        emailTemplates(templatesDir, function(err, template) {
          if (err) {
            res.serverError();
          } else {
            template('recover', {
              link     : link,
              email    : email,
              username : user.username
            }, function (err, html, text) {
              if (err) {
                return res.serverError();
              } else {
                transporter.sendMail({
                  from: 'alisabelousova007@gmail.com',
                  sender: 'alisabelousova007@gmail.com',
                  to: 'alisabelousova007@gmail.com',
                  replyTo: 'alisabelousova007@gmail.com',
                  subject: 'Account recovery',
                  html: html,
                  text: text
                });

                return res.json({ message: 'Please, check your email' });
              }
            });
          }
        })
      }
    });
  }
};
