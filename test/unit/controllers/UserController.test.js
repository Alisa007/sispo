/**
 * Created by alisabelousova on 4/28/15.
 */

var request = require('supertest');

describe('UserController', function() {
  describe('GET /user/ga-token', function () {
    it('respond with google analytics token', function (done) {
      request(sails.hooks.http.app)
        .get('/user/ga-token')
        .expect(200)
        .expect(res.body.should.have.property('token'))
        .end(done);
    });
  });

  describe('GET /user/current', function () {
    it('respond with current user', function (done) {
      request(sails.hooks.http.app)
        .get('/user/ga-token')
        .expect(200)
        .end(done);
    });
  });
});
