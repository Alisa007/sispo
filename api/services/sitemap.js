/**
 * Created by alisabelousova on 3/26/15.
 */

var sm = require('sitemap');

var sitemap = sm.createSitemap ({
  hostname: 'http://localhost:1337',
  cacheTime: 0,        // 600 sec - cache purge period
  urls: [
    { url: '/users',  changefreq: 'daily', priority: 0.3 },
    { url: '/users/:id',  changefreq: 'monthly',  priority: 0.7 },
    { url: '/posts'},    // changefreq: 'weekly',  priority: 0.5
    { url: '/posts/:id'}
  ]
});

sitemap.build = function (req, res, next) {
  User.find().exec(function(err, users) {
    users.forEach( function (user, index) {
      sitemap.add({ url: '/users/' + user.id });
    });
  });

  Post.find().exec(function(err, posts) {
    posts.forEach( function (post, index) {
      sitemap.add({ url: '/posts/' + post.id });
    });
  });
};

module.exports = sitemap;
