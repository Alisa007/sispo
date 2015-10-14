/**
 * PostController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  createPost: function(req, res) {
    Post.create({
      title : req.body.title,
      text  : req.body.text,
      author: req.body.author
    }).exec(function (err, post) {
      if (err || !post) {
        return res.serverError(err);
      } else {
        req.body.tags.forEach(function(tag) {
          Tag.findOrCreate({
            text: tag.text
          }).exec(function (err, tag) {
            post.tags.add(tag.id);
            post.save();
          });
        });

        return res.json(post);
      }
    });
  }
};

