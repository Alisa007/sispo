/**
 * Created by alisabelousova on 4/2/15.
 */

var request = require('supertest');

describe('PostController', function() {
  describe('POST /createPost', function () {
    it('save received post with tags', function (done) {
      request(sails.hooks.http.app)
        .post('/createPost')
        .send({
          title: 'title',
          text: 'text',
          author: {
            username: 'User123'
          },
          tags: ['1', '2', '3']
        })
        .expect(200)
        .expect(res.body.should.have.property('post'))
        .end(done);
    });
  });
});
