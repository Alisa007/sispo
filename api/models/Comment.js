/**
 * Created by alisabelousova on 3/27/15.
 */

module.exports = {
  attributes: {
    text         : { type: 'string' },
    votes        : { type: 'integer', defaultsTo : 0, required: true  },
    author       : { model: 'user' },
    post         : { model: 'post', required: true  }
  }
};
