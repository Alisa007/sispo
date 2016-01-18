/**
 * Created by alisabelousova on 4/15/15.
 */

module.exports = {

  /**
   * Get mailbox of provided user
   */

  getMailBox: function(req, res) {
    var profile = req.query.profile;

    MailChain.find({
      sort: 'createdAt desc'
    }).populate('users').populate('mails').exec(function (err, results) {
      var mailChains = [];

      results.forEach(function(mailChain) {
        if (mailChain.users[0] && mailChain.users[1]) {
          if (mailChain.users[0].id == profile || mailChain.users[1].id == profile) {
            mailChains.push(mailChain);
          }
        }
      });

      res.json(mailChains);
    });
  },

  /**
   * Start a conversation between 2 users
   */

  createMailChain: function(req, res) {
    var sender = req.body.sender;
    var receiver = req.body.receiver;
    var isFound = false;

    if (sender && receiver) {
      MailChain.find().populate('users').exec(function (err, results) {
        for (var i = 0; i < results.length; i++) {
          if (results[i].users[0] && results[i].users[1]) {
            if (
              (results[i].users[0].id == sender && results[i].users[1].id == receiver) ||
              (results[i].users[1].id == sender && results[i].users[0].id == receiver)
            ) {
              isFound = true;
              res.json(results[i]);
              break;
            }
          }
        }

        if (isFound == false) {
          MailChain.create().populate('users').exec(function(err, mailChain) {
            mailChain.users.add(sender);
            mailChain.users.add(receiver);
            mailChain.save(function(err) {});
            res.json(mailChain);
          });
        }
      });
    }
  }
};

