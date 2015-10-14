/**
 * Created by alisabelousova on 6/2/15.
 */

module.exports = {
  attributes: {
    post         : { model: 'post' },
    comment      : { model: 'comment' },
    user         : { model: 'user', required: true }
  }
};
