'use strict';

/* Controllers */

var expensesControllers = angular.module('expensesControllers', [])

.controller('HomeCtrl', ['$scope',
  function($scope) {
    $scope.name = 'smth';
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
