var expensesApp = angular.module('expensesApp',[
  'ng-token-auth',
  //'ngRoute',
  'ui.router',
  'templates',
  'expensesControllers',
  'expensesServices',
  'bgf.paginateAnything'
])

.config(['$authProvider', 'UserProvider',
  function($authProvider, UserProvider) {
    $authProvider.configure({
      apiUrl:                  '/auth',
      tokenValidationPath:     '/validate_token',
      signOutUrl:              '/sign_out',
      emailRegistrationPath:   '/',
      accountUpdatePath:       '/',
      accountDeletePath:       '/',
      passwordResetPath:       '/password',
      passwordUpdatePath:      '/password',
      emailSignInPath:         '/sign_in',

      handleLoginResponse: function(response) {
        UserProvider.$get().setData(response.data);
        return response;
      },

      handleTokenValidationResponse: function(response) {
        //console.log('validation');
        UserProvider.$get().setData(response.data);
        return response.data;
      }
    });
  }])

.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('login', {
          url: "/login",
          templateUrl: "index.html",
          controller: 'HomeCtrl',
          data: {
            access: 'anon'
          }
        })
        .state('user',{
          abstract: true,
          template: '<ui-view/>',
          resolve: {
            auth: ['$auth', function ($auth) {
              //console.log('resolve');
              return $auth.validateUser();
            }]
          }

        })
        .state('user.accounts', {
          url: "/",
          templateUrl: "accounts.html",
          controller: 'AccountsCtrl',
          data: {
            access: 'user'
          },
          resolve: {
            Smth: ['auth', 'Accounts', function(auth, Accounts) {
              //console.log('resolve 2');
              //console.log(auth);
              return Accounts.loadUserData();
            }]
          }
        })
        .state('user.accounts.single', {
          url: "acc/:id",
          templateUrl: "accounts_single.html",
          controller: 'AccountsSingleCtrl',
          data: {
            access: 'user'
          }
        })
        .state('users', {
          url: "/users",
          templateUrl: "users.html",
          controller: 'UsersCtrl',
          data: {
            access: 'admin'
          }
        })
    ;
  }])

.run(['$rootScope', 'User', '$state',
  function($rootScope, User, $state) {
    $rootScope.$on("$stateChangeSuccess",
      function (event, toState, toParams, fromState, fromParams) {
        var user = User.getData();
        if (toState.data.access == 'user'){
          if (!user) {
            $state.go('login');
          }
        }

        if (toState.data.access == 'admin'){
          if (!user.isAdmin()) {
            $state.go('login');
          }
        }
      });

    $rootScope.$on("$stateChangeError",
      function (event, toState, toParams, fromState, fromParams, error) {
        if (error.reason == 'unauthorized'){
          $state.go('login');
        }
        else {
          console.log(error);
        }
      });

    $rootScope.$on('auth:login-success', function(ev, user) {
      $state.go('user.accounts');
    });
}])
;