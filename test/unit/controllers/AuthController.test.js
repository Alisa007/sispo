/**
 * Created by alisabelousova on 5/31/15.
 */

var request = require('supertest')
  , transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'alisabelousova007@gmail.com',
      pass: 'anapa007'
    }
  });

describe('AuthController', function() {
  describe('GET /auth/options', function () {
    it('respond with social authentication providers list', function (done) {
      request(sails.hooks.http.app)
        .get('/auth/options')
        .expect(200)
        .expect(res.body.should.have.property('providers'))
        .end(done);
    });
  });

  describe('POST /auth/login', function () {
    it('send login credentials and respond with current user and token', function (done) {
      request(sails.hooks.http.app)
        .post('/auth/login')
        .send({
          email    :'123@gmail.com',
          password : '123123'
        })
        .expect(200)
        .end(done);
    });
  });

  describe('POST /auth/signup', function () {
    it('send authentication credentials and respond with token', function (done) {
      request(sails.hooks.http.app)
        .post('/auth/signup')
        .expect(200)
        .end(done);
    });
  });
});
