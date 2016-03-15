'use strict';

/* Controllers */

var expensesControllers = angular.module('expensesControllers', [])

.controller('HomeCtrl', ['$scope', '$location', 'User', '$state',
  function($scope, $location, User, $state) {
    $scope.selected = 'login';
  }])

.controller('AccountsCtrl', ['$scope', '$http', '$auth', 'User', 'Accounts',
  function($scope, $http, $auth, User, Accounts) {
    $scope.selected = 'expense';
    $scope.accounts = Accounts.getAccounts();
    $scope.expenseDate = todayStr();
    $scope.incomeDate = todayStr();
    $scope.transferDate = todayStr();
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
      Accounts.addTransaction({
        sender_id: $scope.expenseAccId,
        amount: $scope.expenseAmount,
        comment: $scope.expenseComment,
        time: $scope.expenseDate
      }).then(function(){
        resetForms();
        reloadAccs();
      });
    };

    $scope.addIncome = function(){
      Accounts.addTransaction({
        receiver_id: $scope.incomeAccId,
        amount: $scope.incomeAmount,
        comment: $scope.incomeComment,
        time: $scope.incomeDate
      }).then(function(){
        resetForms();
        reloadAccs();
      });
    };

    $scope.addTransfer = function(){
      Accounts.addTransaction({
        sender_id: $scope.transferFromId,
        receiver_id: $scope.transferToId,
        amount: $scope.transferAmount,
        comment: $scope.transferComment,
        time: $scope.transferDate
      }).then(function(){
        resetForms();
        reloadAccs();
      });
    };

    function reloadAccs(){
      Accounts.reload().then(function(){
        $scope.newAccTitle = '';
        $scope.accounts = Accounts.getAccounts()
      });
    }

    function todayStr(){
      var today = new Date();
      return today.getFullYear() + '-'
          + (today.getMonth() > 8 ? '' : '0') + (today.getMonth() + 1) + '-'
          + (today.getDate() > 9 ? '' : '0') + today.getDate()
    }

    function resetForms(){
      $scope.expenseAccId = null;
      $scope.expenseComment = '';
      $scope.expenseAmount = '';

      $scope.incomeAccId = null;
      $scope.incomeComment = '';
      $scope.incomeAmount = '';

      $scope.transferFromId = null;
      $scope.transferToId = null;
      $scope.transferComment = '';
      $scope.transferAmount = '';
    }
  }])

.controller('AccountsSingleCtrl', ['$scope', '$auth', '$state', '$stateParams', 'User', 'Accounts',
  function($scope, $auth, $state, $stateParams, User, Accounts) {
    $scope.transactions = [];
    $scope.currentAcc = Accounts.getById($stateParams.id);
    $scope.page = 0;
    $scope.perPage = 10;
    $scope.url = '/users/'+User.getData().id+'/accounts/'+$stateParams.id+'/transactions.json';
    $scope.authHeaders = $auth.retrieveData('auth_headers');
    $scope.$watchCollection('accounts', function(before, after){
        if (before != after){
          $state.go('user.accounts.single', {id: $stateParams.id}, {reload: true});
        }
    });

    $scope.deleteTransaction = function(id){
      if (!confirm('Are you sure?')){
        return false;
      }
      Accounts.deleteTransaction(id, $stateParams.id).then(function(){
        // TODO: should have the way to reload paginated element itself
        $state.go('user.accounts.single', {id: $stateParams.id}, {reload: true});
      });
    };
  }])

.controller('AccountsReportCtrl', ['$scope', '$auth', '$state', '$stateParams', 'User', 'Accounts',
  function($scope, $auth, $state, $stateParams, User, Accounts) {
    $scope.currentAcc = Accounts.getById($stateParams.id);

    $scope.generate = function(){
      Accounts.report({
        account_id: $scope.currentAcc.id,
        user_id: User.get('id'),
        // TODO: WHY SHOULD I DO THIS AGAIN?
        date_from: this.dateFrom,
        date_to: this.dateTo
      }).then(function(response){
        $scope.report = response.data;
      });
    };
  }])

.controller('UsersCtrl', ['$scope', '$auth', '$state', '$stateParams', 'Users',
  function($scope, $auth, $state, $stateParams, Users) {
    $scope.page = 0;
    $scope.perPage = 10;
    $scope.url = '/users.json';
    $scope.authHeaders = $auth.retrieveData('auth_headers');

    $scope.deleteUser = function(id){
      if (!confirm('Are you sure?')){
        return false;
      }
      Users.deleteById(id).then(function(){
        $state.go('users', {}, {reload: true});
      });
    };
  }])
;