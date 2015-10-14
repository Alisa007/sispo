/**
 * Created by alisabelousova on 3/24/15.
 */

var bodyParser = require('body-parser');

module.exports = function (req, res, next) {
  bodyParser.json(); // for parsing application/json
  next();
};
