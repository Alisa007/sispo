/**
 * Created by alisabelousova on 4/28/15.
 */

var request = require('supertest')
  , should = require('chai').expect;

describe('UserController', function() {
  describe('#accessAnalytics()', function() {
    it('should respond with google analytics token', function (done) {
      request(sails.hooks.http.app)
        .get('/user/ga-token')
        .expect(200, done);
        //.expect(res.body.should.have.property('token'));
    });
  });

  //describe('UsersController', function() {
  //
  //  describe('#login()', function() {
  //    it('should redirect to /mypage', function (done) {
  //      request(sails.hooks.http.app)
  //        .post('/users/login')
  //        .send({ name: 'test', password: 'test' })
  //        .expect(302)
  //        .expect('location','/mypage', done);
  //    });
  //  });
  //
  //});

  //describe('#uploadAvatar()', function(req, res) {
  //  it('should respond with google analytics token', function (done) {
  //    request(sails.hooks.http.app)
  //      //.post('/users/ga-token')
  //      //.send({ name: 'test', password: 'test' })
  //      //.expect(302)
  //      //.expect('location','/mypage', done);
  //      .post('/user/avatar')
  //      //.send({ name: 'test', password: 'test' })
  //      .expect(200);
  //  });
  //});
  //
  //describe('UsersController', function() {
  //
  //  describe('#confirmEmail()', function() {
  //    it('should redirect to /mypage', function (done) {
  //      request(sails.hooks.http.app)
  //        .post('/users/login')
  //        .send({ name: 'test', password: 'test' })
  //        .expect(302)
  //        .expect('location','/mypage', done);
  //    });
  //  });
  //
  //  describe('#resetPassword()', function() {
  //    it('should redirect to /mypage', function (done) {
  //      request(sails.hooks.http.app)
  //        .post('/users/login')
  //        .send({ name: 'test', password: 'test' })
  //        .expect(302)
  //        .expect('location','/mypage', done);
  //    });
  //  });
  //});

  //.post('/')
  //.attach('avatar', 'test/fixtures/homeboy.jpg')

});
