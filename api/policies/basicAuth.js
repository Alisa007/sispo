/**
 * basicAuth Policy
 *
 * Policy for authorizing API requests. The request is authenticated if the
 * it contains the valid identifier and password in body or as a query param.
 * Add this policy (in config/policies.js) to controller actions which are not
 * accessed through a session. For example: API request from another client
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */


module.exports = function (req, res, next) {
  return passport.authenticate('basic', { session: false })(req, res, next);
};
