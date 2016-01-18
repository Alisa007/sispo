/**
 * Created by alisabelousova on 10/10/14.
 */

'use strict';

angular.module('app.user', ['ngAutocomplete', 'ngEditable'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/users', {
        templateUrl: '/templates/user/list.html',
        controller: 'UserListController',
        name: 'users'})
      .when('/users/:slug', {
        templateUrl: '/templates/user/detail.html',
        controller: 'UserDetailController',
        name: 'users'});
    })

  .controller('UserListController', function($scope, $rootScope, $window, $http, Restangular) {
    $scope.user = {};
    $scope.users = {};
    $scope.skip = 5;

    $scope.options = {
      types: ('cities')
    };

    Restangular.one("user").get().then(function(response){
      $scope.users = response;
      $scope.users.forEach(function(user) {
        user.breed = user.breed.breed;
      })
    });

    $scope.loadUsers = function(query) {
      var here = '{"username":{"contains":"' + query + '"}}';

      return Restangular.one('user').get({
        where: here }).then(function (response) {
        return response;
      });
    };

    $scope.loadBreeds = function(query) {
      var here = '{"breed":{"contains":"' + query + '"}}';

      return Restangular.one('breed').get({
        isApproved: true,
        where: here
      }).then(function (response) {
        return response;
      });
    };
  })

  .controller('UserDetailController', function($scope, $rootScope,
                                               Upload, $routeParams,
                                               $http, Restangular, growl) {
    $scope.avatar = {};

    Restangular.one("user", $routeParams.slug).get().then(function(response){
      $scope.user = response;
      console.log($scope.user);
    }).catch(function(response){
      Restangular.one('user').get({ slug: $routeParams.slug }).then(function(response) {
        $scope.user = response[0];

        if (!$scope.user.age) {
          $scope.user.age = 0;
        }
        console.log($scope.user);
      });
    });

    $scope.loadBreeds = function(query) {
      var here = '{"breed":{"contains":"' + query + '"}}';

      return Restangular.one('breed').get({
        isApproved: true,
        where: here }).then(function (response) {
        return response;
      });
    };

    $scope.loadKinds = function(query) {
      var here = '{"kind":{"contains":"' + query + '"}}';

      return Restangular.one('kind').get({
        isApproved: true,
        where: here }).then(function (response) {
        return response;
      });
    };

    $scope.$watch('files', function () {
      console.log('avatar watch event');
      $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
      console.log('avatar upload event');
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];

          Upload.upload({
            url: '/createImage',
            //fields: {'id': $rootScope.profile.id},
            file: file
          }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
          }).success(function (data, status, headers, config) {
            var url = 'https://sispo.blob.core.windows.net/user/' + data.files[0].fd;
            console.log(url);
            $scope.user.avatar = url;
          });
        }
      }
    };

    $scope.$watch('user.isLost', function () {
      if ($scope.user.isLost) {
        $scope.user.isFound = false;
      }
    });

    $scope.$watch('user.isFound', function () {
      if ($scope.user.isFound) {
        $scope.user.isLost = false;
      }
    });

    function createBreed(kind) {
      Restangular.one("breed").post("", {
        breed : $scope.user.breed.breed,
        kind  :  kind
      }).then(function(response) {
        Restangular.one("user", $rootScope.profile.id).put({
          breed: response.id
        }).then(function(response) {
          growl.success(response.data.message ? response.data.message : "You created a new breed of " + response.kind.kind);
        });
      });
    }

    $scope.save = function(user) {
      if (user.breed) {
        if (user.breed.id) {
          Restangular.one("user", $rootScope.profile.id).put({
            breed: user.breed.id
          });
        } else if (user.breed.breed) {
          if (user.breed.kind) {
            if (user.breed.kind.id) {
              createBreed(user.breed.kind.id);
            } else if (user.breed.kind.kind) {
              Restangular.one("kind").post("", {
                kind : user.breed.kind.kind
              }).then(function(response) {
                growl.success(response.message ? response.message : "You created a new animal kind");
                createBreed(response.id);
              });
            }
          }
        }
      }

      Restangular.one("user", $rootScope.profile.id).put({
        username: $scope.user.username,
        isLost: $scope.user.isLost,
        isFound: $scope.user.isFound,
        age: $scope.user.age,
        gender: $scope.user.gender,
        avatar: $scope.user.avatar
      }).then(function(response) {
        $rootScope.profile = response;
        growl.success(response.message ? response.message : "Your profile is updated");
      }).catch(function(response) {
        growl.error(response.message ? response.message : "Sorry, we couldn't update your profile information");
      });
    };

    $scope.follow = function(user) {
      Restangular.one("user", $rootScope.profile.id).put({
        friends : user
      }).then(function(response){
        growl.success(response.message ? response.message : "User is now followed");
      }).catch(function(response) {
        growl.error(response.message ? response.message : $rootScope.default.messages.error);
      });
    };

    $scope.report = function(user) {
      Restangular.one("user", user).put({
        isModerated: false
      }).then(function(response){
        growl.success(response.message ? response.message : "User has been reported");
      }).catch(function(response) {
        growl.error(response.message ? response.message : $rootScope.default.messages.error);
      });
    };

    $scope.submitBreed = function(item, model, label) {
      console.log('submit breed');
      if (item && typeof item === 'object') {
        $scope.user.breed.id = item.id;
        $scope.user.isNewBreed = false;
      } else {
        $scope.user.breed.id = undefined;
        $scope.user.isNewBreed = true;
      }
    };

    $scope.submitKind = function(item, model, label) {
      console.log('kind submit');
      if (item && typeof item === 'object') {
        $scope.user.breed.kind.id = item.id;
        console.log('object');

      } else {
        $scope.user.breed.kind.id = undefined;
        console.log('not object');

      }
    };
  });
