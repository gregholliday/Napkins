angular.module('napkins.controllers', [])
.controller('LoginCtrl',['$scope','$state','$ionicLoading','Azureservice', 'store', 'auth',function($scope,$state,$ionicLoading,Azureservice,store,auth){
    $scope.loginFacebook = function(){
        Azureservice.login('facebook')
        .then(function() {
            console.log(Azureservice.getCurrentUser());
        },function(err){
            $scope.message = 'Azure Error: ' + err;
        })
    }

    $scope.login = function() {
      auth.signin({
        authParams: {
          scope: 'openid offline_access',
          device: 'Mobile device'
        }
      }, function(profile, token, accessToken, state, refreshToken) {
        // Success callback
        store.set('profile', profile);
        store.set('token', token);
        store.set('refreshToken', refreshToken);

        auth.getToken().then(function(value) {
          console.log(value);
          $scope.azureUser = {
            userId: auth.profile.user_id,
            mobileServiceAuthenticationToken: value.id_token
          }
          console.log($scope.azureUser);
          Azureservice.setCurrentUser($scope.azureUser);
          $state.go("tab.ideas");
        }, function(error){
          console.log(error);
        });


      }, function(error) {
        // Error callback
        console.log(error);
      });
    }

}])

.controller('IdeasCtrl',['$scope','$state', function($scope,$state) {
  $scope.ideas = [];

  $scope.addNew = function(){
    console.log("Add new tab");
    $state.go("create");
  }
}])

.controller('CreateIdeasCtrl',['$scope', function($scope) {
  console.log("Create a new idea");
}])

.controller('CommunityCtrl', function($scope) {
})

.controller('PresentationCtrl', function($scope) {
})

.controller('ProfileCtrl', ['$scope','$state','store','auth','Azureservice', function($scope,$state,store,auth,Azureservice) {
  $scope.auth = auth;
  console.log("Auth Object");
  console.log($scope.auth);

  $scope.profile = store.get('profile');
  console.log("Profile Object");
  console.log($scope.profile);

  Azureservice.invokeApi('test',{method:'get'})
    .then(function(response){
      console.log('Here is my response object');
      console.log(response);
    }, function(err){
      console.log('Azure Error: ' + err);
    });
}])
