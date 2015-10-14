/**
 * Created by alisabelousova on 5/31/15.
 */

var blobAdapter    = require('skipper-azure');

module.exports = {
  createImage: function(req, res) {
    var file = req.file('file');

    file.upload({
      adapter: blobAdapter,
      key: 'sispo',
      secret: '9Og/mKYomnrJna72RjJYpQ5nBqJfsD17ceTay6tkKrn6lJA/1lliZ8mo5guVDSg2IbmEx5R9Bg0xB11FFUUKNQ==',
      container: 'user'
    }, function (err, files) {
      if (err) {
        return res.serverError(err);
      } else res.json({files: files});
    });
  }


};
