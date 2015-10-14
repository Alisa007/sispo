/**
 * Created by alisabelousova on 3/27/15.
 */

module.exports = {
  attributes: {
    text        : { type: 'string', unique: true, required: true },
    isApproved  : { type: 'boolean', defaultsTo: true },
    isModerated : { type: 'boolean', defaultsTo: false }
  }
};
