/**
 * Created by alisabelousova on 10/14/14.
 */


'use strict';

angular.module('app', [
  'ui.bootstrap',
  'angular-loading-bar',
  'ngRoute',
  'ngResource',
  'ngAnimate',
  'ngCookies',
  "ngTouch",
  'ngSanitize',
  'ngSails',
  'ngMaterial',
  'ngTagsInput',
  'ngFileUpload',
  'restangular',
  'app.admin',
  'app.auth',
  'app.user',
  'app.post',
  'app.mail',
  'infinite-scroll',
  'angular-growl'
])
  .config(function (cfpLoadingBarProvider, $locationProvider,
                    $routeProvider, $resourceProvider, $mdThemingProvider,
                    $httpProvider, $sailsProvider, RestangularProvider, growlProvider) {

    $routeProvider
      .when('/', {
        redirectTo: "/posts"})
      .when('/error/404', {
        templateUrl: "/templates/error/404.html"})
      .otherwise({
        redirectTo: "/error/404"})
    ;

    $resourceProvider.defaults.stripTrailingSlashes = true;

    $locationProvider.html5Mode(true);

    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.latencyThreshold = 1;

    growlProvider.globalTimeToLive(10000);
    growlProvider.globalReversedOrder(true);
    growlProvider.globalDisableCountDown(true);
  })
  .run( function($location, $rootScope, $auth, Restangular, $modal, growl) {
    $rootScope.new = {
      mails: 0
    };

    $rootScope.default = {
      avatar : 'http://www.psvitawalls.com/thumbs/anon-t2.jpg',
      messages : {
        error: 'Sorry, we made a mistake. Please, try again later',
        success: 'You request is successful'
      }
    };

    $rootScope.go = function (path) {
      $location.path( path );
    };

    $rootScope.deleteProfile = function() {
      Restangular.one('user', $rootScope.profile.id).remove().then(function (response) {
        $rootScope.logout();
      });
    };

    $rootScope.loadPosts = function(query) {
      return Restangular.one('post').get({ where: '{"title":{"contains":"' + query + '"}}' });
    };

    $rootScope.select = function(item) {
      $location.url('/posts/' + item.slug);
      $rootScope.selected = '';
    };

    $rootScope.openLogin = function () {
      $modal.open({
        templateUrl: 'templates/auth/login.html',
        controller: 'LoginController',
        size: 'sm'
      });
    };

    $rootScope.openSignup = function () {
      var modalInstance = $modal.open({
        templateUrl: 'templates/auth/signup.html',
        controller: 'SignupController',
        size: 'sm'
      });
    };

    $rootScope.logout = function () {
      $auth.logout().then(function(response) {
        $rootScope.profile = undefined;
        growl.success("You are logged out" );
      }).catch(function(response) {
        growl.error(response.data.message ? response.data.message : $rootScope.default.messages.error);
      });
    };
  });
