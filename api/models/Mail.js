/**
 * Created by alisabelousova on 3/27/15.
 */

module.exports = {
  attributes: {
    text        : { type: 'string' },
    sender      : { model: 'user' },
    receiver    : { model: 'user' },
    mailChain   : { model: 'mailChain' },
    isRead      : { type: 'boolean', defaultsTo : false }
  }
};
