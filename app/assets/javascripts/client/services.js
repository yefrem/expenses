angular.module('expensesServices', [])
  .provider('User', function() {
    var userData = null;

    return {
      $get: function(){
        return {
          setData: function(data){
            userData = data;
          },

          isAdmin: function(){
            return userData && typeof(userData.admin) != 'undefined' && userData.admin;
          },

          getData: function() {
            return userData;
          },

          loggedIn: function(){
            return !!userData;
          },

          get: function(field){
            return userData[field]
          }
        }
      }
    };
  })

  .factory('Users', ['$http', '$auth', function($http, $auth){
      return {
        deleteById: function (id) {
          return $http({
            method: "DELETE",
            url: '/users/'+id+'.json',
            headers: $auth.retrieveData('auth_headers')
          });
        }
      };
  }])


  .factory('Accounts', ['User', '$http', '$auth', function(User, $http, $auth){
      var userData = null;
      return {
        loadUserData: function(){
          return $http({
            method: "GET",
            url: '/users/'+User.getData().id+'.json',
            // TODO: remove this duplication
            headers: $auth.retrieveData('auth_headers')
          }).then(function (res) {
            userData = res.data;
          });
        },

        reload: function () {
          return this.loadUserData();
        },

        getAccounts: function(){
          return userData.accounts;
        },

        createNew: function(title){
          return $http({
            method: "POST",
            url: '/users/'+User.getData().id+'/accounts.json',
            headers: $auth.retrieveData('auth_headers'),
            data: {
              account: {
                title: title,
                user_id: User.get('id')
              }
            }
          });
        },

        deleteAcc: function(id){
          return $http({
            method: "DELETE",
            url: '/users/'+User.getData().id+'/accounts/'+id+'.json',
            headers: $auth.retrieveData('auth_headers')
          });
        },

        getById: function(id){
          for (var i in userData.accounts){
            if (userData.accounts[i].id == id){
              return userData.accounts[i];
            }
          }
        },

        updateTransaction: function(transactionData){
          var accId = transactionData.sender_id ? transactionData.sender_id : transactionData.receiver_id;
          return $http({
            method: "PATCH",
            url: '/users/'+User.getData().id+'/accounts/'+accId+'/transactions/'+transactionData.id+'.json',
            headers: $auth.retrieveData('auth_headers'),
            data: {
              account_id: accId,
              user_id: User.get('id'),
              transaction: transactionData
            }
          });
        },

        addTransaction: function(transactionData){
          var accId = transactionData.sender_id ? transactionData.sender_id : transactionData.receiver_id;
          return $http({
            method: "POST",
            url: '/users/'+User.getData().id+'/accounts/'+accId+'/transactions.json',
            headers: $auth.retrieveData('auth_headers'),
            data: {
              account_id: accId,
              user_id: User.get('id'),
              transaction: transactionData
            }
          });
        },
        deleteTransaction: function(id, accountId){
          return $http({
            method: "DELETE",
            url: '/users/'+User.getData().id+'/accounts/'+accountId+'/transactions/'+id+'.json',
            headers: $auth.retrieveData('auth_headers')
          });
        },
        report: function(data){
          return $http({
            method: "GET",
            url: '/users/'+User.getData().id+'/accounts/'+data.account_id+'/report.json?date_from='+data.date_from+'&date_to='+data.date_to,
            headers: $auth.retrieveData('auth_headers')
          });
        }
      }
  }])

;