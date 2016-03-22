// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('napkins', ['ionic',
  'napkins.controllers',
  'napkins.services',
  'azure-mobile-service.module',
  'auth0',
  'angular-storage',
  'angular-jwt'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.constant('AzureMobileServiceClient',{API_URL:'https://beerandnapkins.azure-mobile.net/', API_KEY:'MMXQUXIkqOSpROiheLRMHPBzchdvWZ86' })

.config(function($stateProvider, $urlRouterProvider,authProvider, $httpProvider, jwtInterceptorProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

    .state('create', {
      url: '/create',
      templateUrl: 'templates/tab-create.html',
      controller: 'CreateIdeasCtrl',
      data: {requiresLogin: true}
    })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  .state('tab.ideas', {
    url: '/ideas',
    views: {
      'tab-ideas': {
        templateUrl: 'templates/tab-ideas.html',
        controller: 'IdeasCtrl'
      }
    },
    data: {requiresLogin: true}
  })

  .state('tab.community', {
    url: '/community',
    views: {
      'tab-community': {
        templateUrl: 'templates/tab-community.html',
        controller: 'CommunityCtrl'
      }
    },
    data: {requiresLogin: true}
  })

  .state('tab.presentation', {
    url: '/presentation',
    views: {
      'tab-presentation': {
        templateUrl: 'templates/tab-presentation.html',
        controller: 'PresentationCtrl'
      }
    },
    data: {requiresLogin: true}
  })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    },
    data: {requiresLogin: true}
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

  authProvider.init({
    domain: 'beerandnapkins.auth0.com',
    clientID: 'zF8pijH4gLSKFnP1tLDlqUXn6i3tWjHQ',
    loginState: 'login' // This is the name of the state where you'll show the login, which is defined above...
  });

  jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
    var idToken = store.get('token');
    var refreshToken = store.get('refreshToken');
    if (!idToken || !refreshToken) {
      return null;
    }
    if (jwtHelper.isTokenExpired(idToken)) {
      return auth.refreshIdToken(refreshToken).then(function(idToken) {
        store.set('token', idToken);
        return idToken;
      });
    } else {
      return idToken;
    }
  }

  $httpProvider.interceptors.push('jwtInterceptor');

}).run(function($rootScope, auth, store) {
  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        auth.authenticate(store.get('profile'), token);
      }
    }

  });

});
