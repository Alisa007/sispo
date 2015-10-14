var User = {
  attributes: {
    avatar       : { type: 'string' },
    username     : { type: 'string', unique: true },
    email        : { type: 'email',  unique: true },
    slug         : { type: 'email',  unique: true },
    about        : { type: 'string' },

    isVerified   : { type: 'boolean', defaultsTo : false },
    isAdmin      : { type: 'boolean', defaultsTo : false },
    isModerated  : { type: 'boolean', defaultsTo: false },
    isApproved   : { type: 'boolean', defaultsTo: true },

    location     : { type: 'json' },
    breed        : { model: 'breed' },
    age          : { type: 'integer', defaultsTo : 0 },
    gender       : { type: 'string' },

    isLost       : { type: 'boolean', defaultsTo : false },
    isFound      : { type: 'boolean', defaultsTo : false },

    votes        : { type: 'integer', defaultsTo : 0 },
    tags         : { collection: 'tag' },
    friends      : { collection: 'user' },
    passports    : { collection: 'passport',  via: 'user' },
    posts        : { collection: 'post',      via: 'author' },
    mailChains   : { collection: 'mailChain', via: 'users' },

    verifyToken  : { type: 'string' },
    recoverToken : { type: 'string' }
  },

  beforeCreate: function (values, next) {
    if (values.username) {
      values.slug = values.username.toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');
    }
    next();
  },

  beforeUpdate: function (values, next) {
    if (values.username) {
      values.slug = values.username.toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');
    }
    next();
  }
};

module.exports = User;
