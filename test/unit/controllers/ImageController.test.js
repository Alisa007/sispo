/**
 * Created by alisabelousova on 5/31/15.
 */

var request = require('supertest');

describe('ImageController', function() {
  describe('POST /createImage', function () {
    it('uploads image to azure', function (done) {
      request(sails.hooks.http.app)
        .post('/createImage')
        .attach('file', 'https://www.petfinder.com/wp-content/uploads/2012/11/140272627-grooming-needs-senior-cat-632x475.jpg')
        .expect(200)
        .expect(res.body.should.have.property('files'))
        .end(done);
    });
  });
});
