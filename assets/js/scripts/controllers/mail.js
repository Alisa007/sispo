/**
 * Created by alisabelousova on 10/10/14.
 */

'use strict';

angular.module('app.mail', ['perfect_scrollbar'])
  .controller('MailController', function ($http, $scope, $rootScope,
                                          $routeParams, $sails, Restangular) {

    Restangular.one('searchMailChain').get({
      profile: $rootScope.profile.id
    }).then(function (response) {
      $scope.mailChains = response;

      $scope.mailChains.forEach(function(mailChain) {
        mailChain.mails.reverse();

        mailChain.mails.forEach(function(mail) {
          if (mail.sender == $rootScope.profile.id) {
            mail.sender = $rootScope.profile;
          } else {
            if (mail.sender == mailChain.users[0].id) {
              mail.sender = mailChain.users[0];
            } else {
              mail.sender = mailChain.users[1];
            }
          }
        })
      });

      $scope.goList();
    });

    $scope.goList = function() {
      $scope.heading = 'templates/mail/listHeading.html';
      $scope.mailTemplate = '/templates/mail/list.html';
    };

    $scope.goDetail = function(mailChain) {
      $scope.heading = 'templates/mail/detailHeading.html';
      $scope.mailTemplate = '/templates/mail/detail.html';
      $scope.mailChain = $scope.mailChains[mailChain];
    };

    (function () {
      $sails.get("/mail")
        .success(function (data, status, headers, jwr) {
          //$scope.bars = data;
        })
        .error(function (data, status, headers, jwr) {
          //alert('Houston, we got a problem!');
        });

      // Watching for updates
      $sails.on("mail", function (response) {
        var isFound = false;

        if (response.verb === "created") {
          if (response.data.receiver == $rootScope.profile.id ||
            response.data.sender == $rootScope.profile.id) {

            for(var i = 0; i <  $scope.mailChains.length; i++) {
              if ($scope.mailChains[i].id == response.data.mailChain) {
                $scope.mailChains[i].mails.unshift(response.data);
                isFound = true;
                break;
              }
            }

            if (response.data.receiver.id == $rootScope.profile.id) {
              $rootScope.new.messages = $rootScope.new.messages + 1;
            }
            if (isFound == false) {
              Restangular.one('mailChain', response.data.mailChain).get().then(function (response) {
                $scope.mailChains.unshift(response);
              });
            }
          }
        }
      });
    }());
  })

  .controller('MailListController', function ($scope, $rootScope,
                                              $routeParams, Restangular) {

    $scope.mail = {};

    $scope.loadUsers = function(query) {
      var here = '{"username":{"contains":"' + query + '"}}';

      //remove current user
      return Restangular.one('user').get({
        where: here }).then(function (response) {
        response.forEach(function(user, index) {
          if (user.username == $rootScope.profile.username) {
            response.splice(index, 1);
          }
        });
        return response;
      });
    };

    $scope.error = function(name) {
      var x = $scope.mailForm[name];
      return x.$invalid && x.$dirty ? "has-error" : "";
    };

    $scope.send = function () {

      $scope.mail.sender = $rootScope.profile.id;
      Restangular.one('user').get({
        username: $scope.mail.receiver}).then(function (response) {

        $scope.mail.receiver = response[0].id;
        Restangular.one('createMailChain').post('', $scope.mail).then(function (response) {

          $scope.mail.mailChain = response.id;
          Restangular.one('mail').post('', $scope.mail).then(function (response) {
            $scope.mail = {};
          });
        });
      });
    };
  })
  .controller('MailDetailFormController', function ($http, $rootScope, $scope, $routeParams, growl, Restangular) {

    $scope.send = function () {

      var receiver;

      if ($scope.mailChain.users[0].id == $rootScope.profile.id) {
        receiver = $scope.mailChain.users[1].id;
      } else if ($scope.mailChain.users[1].id == $rootScope.profile.id) {
        receiver = $scope.mailChain.users[0].id;
      }

      var mail = {
        sender    : $rootScope.profile.id,
        receiver  : receiver,
        text      : $scope.text,
        mailChain : $scope.mailChain.id
      };

      Restangular.one("mail").post("", mail).then(function (response) {
        $scope.text = {};
        $scope.mail = {};
      }).catch(function(response) {
        growl.error(response.data.message ? response.data.message : "Sorry, we couldn't send your message.");
      })
    };
  });
