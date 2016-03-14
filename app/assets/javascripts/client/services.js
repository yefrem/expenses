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

        getAccounts: function(){
          return userData.accounts;
        }
      }
  }])

;