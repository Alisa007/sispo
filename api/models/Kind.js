/**
 * Created by alisabelousova on 3/27/15.
 */

module.exports = {
  attributes: {
    kind        : { type: 'string', unique: true, required: true },
    breeds      : { collection: 'breed', via: 'kind'},
    isApproved  : { type: 'boolean', defaultsTo: true },
    isModerated : { type: 'boolean', defaultsTo: false }
  }
};
