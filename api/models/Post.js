/**
* Post.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Post = {
  attributes: {
    slug           : { type: 'string',  unique: true },
    title          : { type: 'string',  unique: true, required: true },
    text           : { type: 'string',  unique: true, required: true },
    tags           : { collection: 'tag' },
    comments       : { collection: 'comment', via: 'post' },
    views          : { type: 'integer', defaultsTo : 0, required: true },
    votes          : { type: 'integer', defaultsTo : 0, required: true },
    author         : { model: 'user' },
    isPosted       : { type: 'boolean', defaultsTo : false },
    isQuestion     : { type: 'boolean', defaultsTo : false },
    isApproved     : { type: 'boolean', defaultsTo: true },
    isModerated    : { type: 'boolean', defaultsTo: false }
  },

  //https://gist.github.com/mathewbyrne/1280286

  beforeCreate: function (values, next) {
    if (values.title) {
      values.slug = values.title.toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');
    }
    next();
  }
};

module.exports = Post;
