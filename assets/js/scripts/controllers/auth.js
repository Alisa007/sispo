/**
 * Created by alisabelousova on 3/13/15.
 */

angular.module('app.auth', ['base64', 'satellizer'])

  .config(function($routeProvider, $authProvider) {
    $routeProvider
      .when('/verify', {
        controller: 'ConfirmController',
        templateUrl: '/templates/post/list.html'})
      .when('/recover', {
        controller: 'RecoverController',
        templateUrl: '/templates/auth/recover.html'});

    $authProvider.facebook({
      clientId: '1838960462995866'
    });

    $authProvider.google({
      clientId: '452483452860-53bqqilqa0fnqmo26hpdr31hsk9ei48e.apps.googleusercontent.com'
    });
  })

  .controller('ConfirmController', function ($http, $scope,
                                             $location, $routeParams, Restangular) {
    if ($routeParams.email && $routeParams.token) {
      Restangular.one("user").get({
        email        : $routeParams.email,
        verifyToken : $routeParams.token
      }).then(function(response){
        var user = response[0];
        if (user) {
          Restangular.one('user', user.id).post('', {isConfirmed: true}).then(function(response) {
            $location.url('/users/' + response.slug);
            growl.success(response.message ? response.message : "Your profile is verified");
          });
        }
      });
    }
  })

  .controller('RecoverController', function ($scope, $rootScope,  $location,
                                             $routeParams, Restangular,  growl, auth) {
    $scope.user = {};

    $scope.recover = function(user, isValid) {
      if (isValid && $routeParams.email && $routeParams.token) {
        Restangular.one("user").get({
          email        : $routeParams.email,
          recoverToken : $routeParams.token
        }).then(function(response){
          var user = response[0];
          if (user) {
            Restangular.one('passport').get({
              provider : 'basic',
              user     : user.id
            }).then(function(response) {
              var passport = response[0];
              Restangular.one('passport', passport.id).put({password: $scope.user.password}).then(function(response) {
                growl.success(response.message ? response.message : "You password is updated");
                auth.log({
                  email: $routeParams.email,
                  password: $scope.user.password
                }, true);
              });
            });
          }
        });
      }
    }
  })
  .controller('SignupController', function ($scope, $rootScope, Restangular,
                                            $auth, growl, auth) {

    $scope.user = {};

    $scope.signup = function (user, isValid) {
      if (isValid) {
        $auth.signup(user).then(function(response) {
          growl.success(response.data.message ? response.data.message : $rootScope.default.messages.success);
          auth.login(user, true);
        }).catch(function(response) {
          growl.error(response.data.message ? response.data.message : $rootScope.default.messages.error);
        });
      }
    };
  })
  .controller('LoginController', function ($scope, $rootScope,
                                           $location, $auth, Restangular, growl, auth) {
    $scope.forgotPassword = false;
    $scope.user = {};

    Restangular.one('auth', 'options').get().then(function(response){
      $scope.providers = response.providers;
    });

    $scope.recover = function (user, isValid) {
      if (isValid) {
        Restangular.one('auth', 'recover').post('', user).then(function(response){
          growl.success(response.message ? response.message : $rootScope.default.messages.success);
        }).catch(function(response) {
          growl.error(response.message ? response.message : $rootScope.default.messages.error);
        });
      }
    };

    $scope.login = function(user, isValid) {
      auth.login(user, isValid);
    };

    $scope.auth = function(provider) {
      $auth.authenticate(provider).then(function(response) {
        response.data.user.slug ?
          $location.path("/users/" + response.data.user.slug) :
          $location.path("/users/" + response.data.user.id);

        $rootScope.profile = response.data.user;
        if ($rootScope.profile.email == 'alisabelousova007@gmail.com') {
          $rootScope.profile.isAdmin = true;
          growl.success("You are logged in as admin" );
        } else {
          growl.success("You are logged in" );
        }
      }).catch(function(response) {
        growl.error(response.data.message ? response.data.message : $rootScope.default.messages.error);
      });
    };
  })
  .factory('auth', function($rootScope, $auth, growl, $location) {
    var auth = {};

    auth.login = function (user, isValid) {
      if (isValid) {
        $auth.login(user).then(function(response) {
          response.data.user.slug ?
            $location.path("/users/" + response.data.user.slug) :
            $location.path("/users/" + response.data.user.id);

          $rootScope.profile = response.data.user;
          if ($rootScope.profile.email == 'alisabelousova007@gmail.com') {
            $rootScope.profile.isAdmin = true;
            growl.success("You are logged in as admin" );
          } else {
            growl.success("You are logged in" );
          }
        }).catch(function(response) {
          growl.error(response.data.message ? response.data.message : $rootScope.default.messages.error);
        });
      }
    };

    return auth;
  });
