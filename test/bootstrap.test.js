/**
 * Created by alisabelousova on 4/1/15.
 */


var Sails = require('sails'),
  sails;

before(function(done) {
  console.log('lift server');
  Sails.lift({
    // configuration for testing purposes
  }, function(err, server) {
    sails = server;
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  console.log('lower server');
  // here you can clear fixtures, etc.
  sails.lower(done);
});
