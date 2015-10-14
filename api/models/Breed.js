/**
 * Created by alisabelousova on 3/27/15.
 */

module.exports = {
  attributes: {
    breed        : { type: 'string', unique: true, required: true },
    kind         : { model: 'kind' },
    isApproved   : { type: 'boolean', defaultsTo: true },
    isModerated  : { type: 'boolean', defaultsTo: false }
  }
};
