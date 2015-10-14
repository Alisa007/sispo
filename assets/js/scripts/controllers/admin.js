/**
 * Created by alisabelousova on 3/13/15.
 */

angular.module('app.admin', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: 'templates/admin/admin.html',
        controller: 'AdminController'})
      .when('/analytics', {
        templateUrl: 'templates/admin/analytics.html',
        controller: 'AnalyticsController'});
  }])

  .controller('AdminController', function ($scope, Restangular) {
    Restangular.one("post").get({
      where: {"isModerated" : false},
      sort: 'createdAt desc',
      limit: 10
    }).then(function(response){
      $scope.posts = response;
    });

    Restangular.one("tag").get({
      where: {"isModerated" : false},
      sort: 'createdAt desc',
      limit: 10
    }).then(function(response){
      $scope.tags = response;
    });

    Restangular.one("kind").get({
      where: {"isModerated" : false},
      sort: 'createdAt desc',
      limit: 10
    }).then(function(response){
      $scope.kinds = response;
    });

    Restangular.one("breed").get({
      where: {"isModerated" : false},
      sort: 'createdAt desc',
      limit: 10
    }).then(function(response){
      $scope.breeds = response;
    });

    Restangular.one("user").get({
      where: {"isModerated" : false},
      sort: 'createdAt desc',
      limit: 10
    }).then(function(response){
      $scope.users = response;
    });

    $scope.approve = function(object, id, isApproved, index) {

      var objectData = {
        isModerated : true,
        isApproved  : isApproved
      };

      Restangular.one(object, id).post('', objectData).then(function (response) {
        if (object == 'post') $scope.posts.splice(index, 1);
        else if (object == 'tag') $scope.tags.splice(index, 1);
        else if (object == 'kind') $scope.kinds.splice(index, 1);
        else if (object == 'breed') $scope.breeds.splice(index, 1);
        else $scope.users.splice(index, 1);
      });
    };
  })

  .controller('AnalyticsController', function ($scope, $modal, $log, Restangular) {
    (function(w,d,s,g,js,fs){
      g=w.gapi||(w.gapi={});g.analytics={q:[],ready:function(f){this.q.push(f);}};
      js=d.createElement(s);fs=d.getElementsByTagName(s)[0];
      js.src='https://apis.google.com/js/platform.js';
      fs.parentNode.insertBefore(js,fs);js.onload=function(){g.load('analytics');};
    }(window,document,'script'));

    gapi.analytics.ready(function() {

      Restangular.one('user', 'ga-token').get().then(function(response){
        console.log(response);

        gapi.analytics.auth.authorize({
          clientid: '452483452860-stt1at87u071ptnnu62c457bnm8b5ofr.apps.googleusercontent.com',
          scopes:   'https://www.googleapis.com/auth/analytics.readonly',
          container: 'embed-api-auth',
          serverAuth: {
            access_token: response.token
          }
        });

        var visitors = new gapi.analytics.googleCharts.DataChart({
          query: {
            metrics: 'ga:users',
            dimensions: 'ga:date',
            ids: 'ga:86520901',
            'start-date': '30daysAgo',
            'end-date': 'yesterday'
          },
          chart: {
            container: 'visitorsChart',
            type: 'LINE',
            options: {width: '100%'}
          }
        }).execute();

        var countries = new gapi.analytics.googleCharts.DataChart({
          query: {
            metrics: 'ga:sessions',
            dimensions: 'ga:country, ga:city',
            //sort: '-ga:sessions',
            ids: 'ga:86520901',
            'start-date': '30daysAgo',
            'end-date': 'yesterday'
          },
          chart: {
            container: 'countriesChart',
            type: 'GEO',
            options: {width: '100%'}
          }
        }).execute();

        var referrers = new gapi.analytics.googleCharts.DataChart({
          query: {
            metrics      : 'ga:newUsers',
            dimensions   : 'ga:fullReferrer',
            sort         : '-ga:newUsers',
            'max-result' : 10,
            ids          : 'ga:86520901',
            'start-date' : '30daysAgo',
            'end-date'   : 'yesterday'
          },
          chart: {
            container    : 'referrersChart',
            type         : 'TABLE',
            options      : {width: '100%'}
          }
        }).execute();

        var bounceRate = new gapi.analytics.googleCharts.DataChart({
          query: {
            metrics      : 'ga:bounceRate',
            ids          : 'ga:86520901',
            'start-date' : '30daysAgo',
            'end-date'   : 'yesterday'
          },
          chart: {
            container    : 'bounceRateChart',
            type         : 'TABLE',
            options      : {width: '100%'}
          }
        }).execute();

      });
    });
  });
