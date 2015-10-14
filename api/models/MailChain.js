/**
 * Created by alisabelousova on 3/27/15.
 */

module.exports = {
  attributes: {
    mails    : { collection: 'mail', via: 'mailChain' },
    users    : { collection: 'user', via: 'mailChains' }
  }
};

