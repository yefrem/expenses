'use strict';

/* Controllers */

var expensesControllers = angular.module('expensesControllers', [])

.controller('HomeCtrl', ['$scope',
  function($scope) {
    $scope.selected = 'login';
  }])

.controller('AccountsCtrl', ['$scope', '$http', '$auth', 'User', 'Accounts', '$filter',
  function($scope, $http, $auth, User, Accounts, $filter) {
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
      var data = {
        sender_id: $scope.expenseAccId,
        amount: $scope.expenseAmount,
        comment: $scope.expenseComment,
        time: $scope.expenseDate
      };
      if ($scope.editedTransaction){
        data.id = $scope.editedTransaction.id;
        Accounts.updateTransaction(data).then(function(){
          $scope.resetForms();
          reloadAccs();
        });
      } else {
        Accounts.addTransaction(data).then(function () {
          $scope.resetForms();
          reloadAccs();
        });
      }
    };

    $scope.addIncome = function(){
      var data = {
        receiver_id: $scope.incomeAccId,
        amount: $scope.incomeAmount,
        comment: $scope.incomeComment,
        time: $scope.incomeDate
      };

      if ($scope.editedTransaction){
        data.id = $scope.editedTransaction.id;
        Accounts.updateTransaction(data).then(function(){
          $scope.resetForms();
          reloadAccs();
        });
      } else {
        Accounts.addTransaction(data).then(function () {
          $scope.resetForms();
          reloadAccs();
        });
      }
    };

    $scope.addTransfer = function(){
      var data = {
        sender_id: $scope.transferFromId,
        receiver_id: $scope.transferToId,
        amount: $scope.transferAmount,
        comment: $scope.transferComment,
        time: $scope.transferDate
      };

      if ($scope.editedTransaction){
        data.id = $scope.editedTransaction.id;
        Accounts.updateTransaction(data).then(function(){
          $scope.resetForms();
          reloadAccs();
        });
      } else {
        Accounts.addTransaction(data).then(function () {
          $scope.resetForms();
          reloadAccs();
        });
      }
    };

    $scope.editTransaction = function(id) {
      var t;
      // TODO always feel bad when doing this
      for (var i in this.transactions){
        if (this.transactions[i].id == id){
          t = this.transactions[i];
        }
      }

      if (!t){
        return false;
      }

      var date = $filter('date')(t.time, 'yyyy-MM-dd');

      if (t.sender && t.receiver){
        // TODO: I swear not to write anything like this anymore
        $scope.editType = $scope.selected = 'transfer';
        $scope.transferDate = date;
        $scope.transferFromId = t.sender.id;
        $scope.transferToId = t.receiver.id;
        $scope.transferAmount = t.amount;
        $scope.transferComment = t.comment;
      } else if (t.sender){
        $scope.expenseDate = date;
        $scope.expenseAccId = t.sender.id;
        $scope.expenseAmount = t.amount;
        $scope.expenseComment = t.comment;
        $scope.editType = $scope.selected = 'expense';
      } else {
        $scope.incomeAccId = t.receiver.id;
        $scope.incomeDate = date;
        $scope.incomeAmount = t.amount;
        $scope.incomeComment = t.comment;
        $scope.editType = $scope.selected = 'income';
      }

      $scope.editedTransaction = t;
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

    $scope.resetForms = function (){
      $scope.editType = null;
      $scope.editedTransaction = null;

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