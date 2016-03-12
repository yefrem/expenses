var expensesApp = angular.module('expensesApp',[
  'ng-token-auth',
  'ngRoute',
  'templates',
  'expensesControllers']
)

.config(['$authProvider',
  function($authProvider) {
    $authProvider.configure({
      apiUrl: '/'
    });
  }])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: "index.html",
        controller: 'HomeCtrl'
      }).
      when('/login', {
        templateUrl: 'templates/login.html',
        controller: 'AuthCtrl'
      }).
      when('/register', {
        templateUrl: 'templates/register.html',
        controller: 'AuthCtrl'
      })
  }]);