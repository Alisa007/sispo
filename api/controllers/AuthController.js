var validator      = require('validator')
  , nodemailer     = require('nodemailer')
  , geoip          = require('geoip-lite')
  , templatesDir   = path.resolve(__dirname, '../..', 'assets', 'templates', 'email')
  , emailTemplates = require('email-templates')
  , passport = require('passport');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alisabelousova007@gmail.com',
    pass: 'anapa007'
  }
});

var AuthController = {
  /**
   * Authenticate with one of social providers
   */

  auth: function (req, res) {
    var provider = req.param('provider');

    switch (provider) {
      case 'google': {
        AuthService.authGoogle(req, res);
        break;
      }
      case 'facebook': {
        AuthService.authFacebook(req, res);
        break;
      }
      default:  return res.status(500).send({ message: 'Unknown provider' });
    }
  },

  /**
   * Send email to the user provided email
   */

  sendEmail: function(req, res, email, link, user) {
    emailTemplates(templatesDir, function(err, template) {
      if (err) {
        res.serverError();
      } else {
        template('register', {
          link: link,
          email: email,
          username: user.username
        }, function (err, html, text) {
          if (err) {
            res.serverError();
          } else {
            transporter.sendMail({
              from: 'alisabelousova007@gmail.com',
              sender: 'alisabelousova007@gmail.com',
              to: 'alisabelousova007@gmail.com',
              replyTo: 'alisabelousova007@gmail.com',
              subject: 'Email confirmation',
              html: html,
              text: text
            });

            res.json({ token: AuthService.createJWT(user), message: 'Please, check your email' });
          }
        });
      }
    })
  },

  /**
   * Register with email and password
   */

  signup: function (req, res) {
    var email    = req.body.email
      , password = req.body.password
      , verifyToken = crypto.randomBytes(48).toString('hex')
      , accessToken  = crypto.randomBytes(48).toString('hex')
      , link = 'http://localhost:1337/verify?email=' + email + '&token=' + verifyToken;

    if (!email || !password) {
      return res.status(400).send('Email or password not specified');
    }

    User.create({
      email : email,
      verifyToken: verifyToken
    }).exec(function(err, user) {
      if (err || !user) {
        return res.status(409).send({ message: 'Email is already taken' });
      } else {
        Passport.create({
          provider      : 'basic'
          , password    : password
          , user        : user.id
          , accessToken : accessToken
        }).exec(function (err, passport) {
          if (err) {
            return user.destroy(function (destroyErr) {
              res.res.status(409).send({ message: 'Passport is already taken' });
            })
          } else {
            AuthController.sendEmail(req, res, email, link, user);
          }
        });
      }
    });
  },

  /**
   * Reset the password
   */

  recover: function (req, res) {
    AuthService.recover(req, res);
  },

  /**
   * Authenticate with email and password
   */

  login: function (req, res) {
    var email    = req.body.email
      , password = req.body.password;

    if (!email || !password) {
      return res.badRequest();
    } else {
      User.findOne({
        email: email
      }).exec(function (err, user) {
        if (err || !user) {
          return res.notFound();
        } else {
          Passport.findOne({
            provider : 'basic'
            , user     : user.id
          }).exec(function (err, passport) {
            if (err || !passport) {
              return res.notFound();
            }

            passport.validatePassword(password, function (err, password) {
              if (err || !password) {
                return res.badRequest();
              } else {
                AuthService.getLocation(req, res, user);

                req.login(user, function (err) {
                  if (err) {
                    res.serverError();
                  } else {
                    // Mark the session as authenticated to work with default Sails sessionAuth.js policy
                    req.session.authenticated = true;

                    res.json({
                      token: AuthService.createJWT(user),
                      user: user
                    });
                  }
                });
              }
            });
          });
        }
      });
    }
  },

  /**
   * List authentication providers
   */

  options: function (req, res) {
    var strategies = sails.config.passport
      , providers  = {};

    // Get a list of available providers for use in your templates.
    Object.keys(strategies).forEach(function (key) {
      if (key === 'basic' || key === 'bearer') {
        return;
      }

      providers[key] = {
        name: strategies[key].name
        , slug: key
      };
    });

    return res.json({providers: providers});
  },


  logout: function (req, res) {
    req.logout();
    req.session.authenticated = false;
    req.session.destroy();
    return res.status(200);
  },

  /**
   * Create a third-party authentication endpoint
   *
   * @param {Object} req
   * @param {Object} res
   */
  provider: function (req, res) {
    passport.endpoint(req, res);
  },

  callback: function (req, res) {

    passport.callback(req, res, function (err, user, challenges, statuses) {
      if (err || !user) {
        return tryAgain(challenges);
      }

      req.login(user, function (err) {
        if (err) {
          console.log('callback error ' + err);
          return res.status(400);
        }

        // Mark the session as authenticated to work with default Sails sessionAuth.js policy
        req.session.authenticated = true;

        res.json({
          user: user
        });
      });
    });
  },

  /**
   * Disconnect a passport from a user
   *
   * @param {Object} req
   * @param {Object} res
   */
  disconnect: function (req, res) {
    passport.disconnect(req, res);
  }
};

module.exports = AuthController;
