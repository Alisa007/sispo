/**
 * Created by alisabelousova on 10/10/14.
 */

'use strict';

angular.module('app.post', ['summernote'])

  .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/posts', {
          templateUrl: '/templates/post/list.html',
          controller: 'PostListController'})
        .when('/posts/new', {
          templateUrl: '/templates/post/form.html',
          controller: 'PostFormController'})
        .when('/posts/:slug', {
          templateUrl: '/templates/post/detail.html',
          controller: 'PostDetailController'})
  }])

  .controller('PostFormController', function ($http, $scope, $rootScope,
                                              Restangular, Upload, $location, growl) {
    $scope.post = {};

    $rootScope.upload = function(files) {
      if (files) {
        Upload.upload({
          url: '/createImage',
          file: files[0]
        }).success(function (data, status, headers, config) {
          var url = 'https://sispo.blob.core.windows.net/user/' + data.files[0].fd;
          $('.summernote').summernote('editor.insertImage', url);
        });
      }
    };

    $scope.submit = function() {
      $scope.post.author = $rootScope.profile.id;

      Restangular.one("createPost").post("", $scope.post).then(function(response){
        $location.url('/posts/' + response.slug);
      });
    };

    $scope.loadTags = function(query) {
      return $http.get('/tag?where={"text":{"contains":"' + query + '"}}');
    };

    $scope.reset = function() {
      $scope.post = {};
    };
  })

  .controller('PostListController', function ($routeParams, $window,
                                              $scope, $rootScope, $http, $sails,
                                              $location, Restangular, growl) {
    if (!$routeParams.sort) $routeParams.sort = 'views';
    if (!$routeParams.time) $routeParams.time = 'all';
    if (!$routeParams.page) $routeParams.page = '1';

    $scope.sort = $routeParams.sort;
    $scope.time = $routeParams.time;
    $scope.page = $routeParams.page;

    $scope.$watch('sort', function() {
      if ($scope.sort != $routeParams.sort) {
        $location.search('sort', $scope.sort)
      }
    });

    $scope.$watch('time', function() {
      if ($scope.time != $routeParams.time) {
        $location.search('time', $scope.time)
      }
    });

    $scope.$watch('page', function() {
      console.log('watch page');
      if ($scope.page != $routeParams.page) {
        $location.search('page', $scope.page)
      }
    });

    $('select').selectpicker();

    $scope.maxSize = 5;
    if ($window.innerWidth >= 768) {
      $scope.maxSize = 10;
    }

    var datetime = new Date();

    switch ($scope.time) {
      case 'day': datetime.setDate(datetime.getDate() - 1);
        break;
      case 'week':
        datetime.setDate(datetime.getDate() - 7);
        break;
      case 'month':
        datetime.setMonth(datetime.getMonth() - 1);
        break;
      default:
        datetime.setYear(2000);
        break;
    }

    Restangular.one("post").get({
      where: '{"createdAt":{">":"' + datetime.toISOString() + '"}}',
      sort: $routeParams.sort + " desc"}).then(function(response){
      $scope.posts = response;
    });

    $rootScope.votePost = function(post, value, index) {
      Restangular.one('vote').get({
        post: post,
        user: $rootScope.profile.id
      }).then(function(response){
        if (!response[0]) {
          Restangular.one('post', post).get().then(function(response){
            response.post("", {votes : response.votes + value}).then(function(response) {
              $scope.posts[index].votes = response.votes;

              Restangular.one('vote').post("", {
                user: $rootScope.profile.id,
                post: post,
                vote: value
              });
            });
          });
        } else {
          growl.error(response.message ? response.message : "Your already voted");
        }
      })
    };
  })

  .controller('PostDetailController', function($scope, $rootScope,
                                               $routeParams,
                                               $sails, Restangular, growl) {

    Restangular.one('post').get({
      slug: $routeParams.slug
    }).then(function(response) {
      $scope.post = response[0];

      Restangular.one('post', $scope.post.id).post("", {views : $scope.post.views + 1}).then(function(response) {
        $scope.post.views = response.views;

        Restangular.one("comment").get({
          post: $scope.post.id,
          sort: 'votes desc'
        }).then(function(response) {
          $scope.post.comments = response;
        });
      });
    });

    $scope.votePost = function(post, value) {
      Restangular.one('vote').get({
        post: post,
        user: $rootScope.profile.id
      }).then(function(response){
        if (!response[0]) {
          Restangular.one('post', post).get().then(function(response){
            response.post("", {votes : response.votes + value}).then(function(response) {
              $scope.post.votes = response.votes;

              Restangular.one('vote').post("", {
                user: $rootScope.profile.id,
                post: post,
                vote: value
              });
            });
          });
        } else {
          growl.error(response.message ? response.message : "Your already voted");
        }
      })
    };

    $scope.voteComment = function(comment, value, index) {
      Restangular.one('vote').get({
        comment: comment,
        user: $rootScope.profile.id
      }).then(function(response){
        if (!response[0]) {
          Restangular.one('comment', comment).get().then(function(response){
            response.post("", {votes : response.votes + value}).then(function(response) {
              $scope.post.comments[index].votes = response.votes;

              Restangular.one('vote').post("", {
                user: $rootScope.profile.id,
                comment: comment,
                vote: value
              });
            });
          });
        } else {
          growl.error(response.message ? response.message : "Your already voted");
        }
      });
    };

    $scope.newComment = undefined;

    $scope.addComment = function(comment, post) {
      Restangular.one('comment').post("", {
        post: post,
        author: $rootScope.profile.id,
        text: comment
      });
    };

    (function () {
      $sails.get("/comment")
        .success(function (data, status, headers, jwr) {
          //$scope.bars = data;
        })
        .error(function (data, status, headers, jwr) {
          //alert('Houston, we got a problem!');
        });

      // Watching for updates
      $sails.on("comment", function (response) {
        console.log('ddd ' + $scope.post.id);
        if (response.verb === "created") {
          if (response.data.post === $scope.post.id) {
            Restangular.one('comment', response.data.id).get().then(function (response) {
              $scope.post.comments.unshift(response);
            });
          }
        }
      });
    }());
  })

  .filter('limitHtml', function() {
    return function(text, limit) {

      var changedString = String(text).replace(/<[^>]+>/gm, '');
      var length = changedString.length;

      return changedString.length > limit ? changedString.substr(0, limit - 1) : changedString;
    }
  });
