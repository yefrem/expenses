'use strict';

/* Controllers */

var expensesControllers = angular.module('expensesControllers', [])

.controller('HomeCtrl', ['$scope', '$location', 'User', '$state',
  function($scope, $location, User, $state) {
    console.log(User.getData());
    if (User.loggedIn()){
      //$state.go('accounts');
    }
  }])

.controller('AccountsCtrl', ['$scope', '$http', '$auth', 'User', 'Accounts',
  function($scope, $http, $auth, User, Accounts) {
    $scope.accounts = Accounts.getAccounts();
    $scope.deleteAcc = function(id){
      if (!confirm('Are you sure?')){
        return false;
      }
      Accounts.deleteAcc(id).then(function(){
        reloadAccs();
      });
    };

    $scope.createAcc = function(){
      Accounts.createNew($scope.newAccTitle).then(function(){
        reloadAccs();
      });
    };

    $scope.addExpense = function(){
      console.log('add expense');
      Accounts.addTransaction({
        sender_id: $scope.expenseAccId,
        amount: $scope.expenseAmount,
        comment: $scope.expenseComment
      }).then(function(){
        reloadAccs();
      });
    };

    $scope.addIncome = function(){
      Accounts.addTransaction({
        receiver_id: $scope.incomeAccId,
        amount: $scope.incomeAmount,
        comment: $scope.incomeComment
      }).then(function(){
        reloadAccs();
      });
    };

    $scope.addTransfer = function(){
      Accounts.addTransaction({
        sender_id: $scope.transferFromId,
        receiver_id: $scope.transferToId,
        amount: $scope.transferAmount,
        comment: $scope.transferComment
      }).then(function(){
        reloadAccs();
      });
    };

    function reloadAccs(){
      Accounts.reload().then(function(){
        $scope.newAccTitle = '';
        $scope.accounts = Accounts.getAccounts()
      });
    }
  }])

.controller('AccountsSingleCtrl', ['$scope', '$auth', '$stateParams', 'User', 'Accounts',
  function($scope, $auth, $stateParams, User, Accounts) {
    $scope.$watchCollection('accounts', function(param){
      $scope.currentAcc = Accounts.getById($stateParams.id);
      $scope.page = 0;
      $scope.perPage = 10;
      $scope.url = '/users/'+User.getData().id+'/accounts/'+$stateParams.id+'/transactions.json';
      $scope.authHeaders = $auth.retrieveData('auth_headers');
    });
  }])
;