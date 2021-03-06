var expensesApp = angular.module('expensesApp',[
  'ng-token-auth',
  //'ngRoute',
  'ui.router',
  'templates',
  'expensesControllers',
  'expensesServices',
  'bgf.paginateAnything',
  '720kb.datepicker'
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
        return response.data;
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
        .state('user.accounts.report', {
          url: "acc/:id/report",
          templateUrl: "accounts_report.html",
          controller: 'AccountsReportCtrl',
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
          },
          resolve: {
            auth: ['$auth', function ($auth) {
              //console.log('resolve');
              return $auth.validateUser();
            }],
            Smth: ['auth', 'Accounts', function(auth, Accounts) {
              return Accounts.loadUserData();
            }]
          }
        })
    ;
  }])

.run(['$rootScope', 'User', '$state',
  function($rootScope, User, $state) {
    $rootScope.$on("$stateChangeSuccess",
      function (event, toState, toParams, fromState, fromParams) {
        var user = User.getData();
        if (toState.data.access != 'anon'){
          if (!user) {
            $state.go('login');
          }
        }

        if (toState.data.access == 'admin'){
          if (!user.admin) {
            $state.go('user.accounts');
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

    $rootScope.$on('auth:registration-email-success', function(ev, user) {
      $state.go('user.accounts');
    });

    $rootScope.$on('auth:logout-success', function(ev, user) {
      $state.go('login');
    });

    $rootScope.$on('auth:login-error', function(ev, reason) {
      $rootScope.loginError = reason.errors.join('\n');
    });

    $rootScope.$on('auth:registration-email-error', function(ev, reason) {
      console.log(reason);
      $rootScope.registerError = reason.errors.full_messages.join('\n');
    });
}])
;