/**
 * Created by alisabelousova on 4/15/15.
 */

var request = require('supertest');

describe('MailChainController', function() {
  describe('GET /getMailBox', function () {
    it('respond with user mailbox containing all mailchains', function (done) {
      request(sails.hooks.http.app)
        .get('/getMailBox')
        .send({ username: 'User123'})
        .expect(200)
        .end(done);
    });
  });

  describe('POST /createMailChain', function () {
    it('create new mail chain or return existing one', function (done) {
      request(sails.hooks.http.app)
        .post('/createMailChain')
        .send({
          sender:  { username: 'User1'},
          receiver: { username: 'User123'}
        })
        .expect(200)
        .end(done);
    });
  });
});
