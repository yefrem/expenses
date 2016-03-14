'use strict';

/* Controllers */

var expensesControllers = angular.module('expensesControllers', [])

.controller('HomeCtrl', ['$scope', '$location', 'User', '$state',
  function($scope, $location, User, $state) {
    console.log(User.getData());
    if (User.loggedIn()){
      //$state.go('accounts');
    }
    //$state.go('accounts');
    //console.log($scope.user);
    //$location.path('accounts');
    //var a = $auth.user;
    //var b = {};
    //b.name = 'qq';
    //console.log(a.name);
    //console.log(b);
    //if ($auth.user.name){
    //  console.log('redir');
    //  $location.path("/accounts");
    //}
    //$scope.name = 'smth';
  }])

.controller('AccountsCtrl', ['$scope', '$http', '$auth', 'User', 'Accounts',
  function($scope, $http, $auth, User, Accounts) {
    $scope.accounts = Accounts.getAccounts();
  }])

.controller('AuthCtrl', ['$scope', '$http', '$auth',
  function($scope, $http, $auth) {
    console.log('auth');
  }]);
//phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
//  function($scope, $routeParams, Phone) {
//    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
//      $scope.mainImageUrl = phone.images[0];
//    });
//
//    $scope.setImage = function(imageUrl) {
//      $scope.mainImageUrl = imageUrl;
//    };
//  }]);
