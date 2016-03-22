angular.module('napkins.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('azureAPI', ['Azureservice' ,'$q', '$rootScope','$ionicLoading', function (Azureservice, $q, $rootScope,$ionicLoading) {

    return {
      getAll: function () {
        var deferred = $q.defer();

        var userId = Azureservice.currentUser.userId;

        //filter by user id
        Azureservice.getTable('Task').where({userId:userId}).read().then(function () {
          deferred.resolve.apply(this, arguments);
          $rootScope.$apply();
        }, function () {
          deferred.reject.apply(this, arguments);
          $rootScope.$apply();
        });

        return deferred.promise;
      },

      addTask: function (task) {

        task.userId = client.currentUser.userId;
        var deferred = $q.defer();

        client.getTable('Task').insert(task).then(function (data) {
          deferred.resolve.apply(this, arguments);
        }, function (error) {
          deferred.reject.apply(this, arguments);
        });
        return deferred.promise;
      },

      updateTask: function (task) {
        var deferred = $q.defer();
        task.userId = client.currentUser.userId;

        client.getTable('Task').update(task).then(function (data) {
          deferred.resolve.apply(this, arguments);
        }, function (error) {
          deferred.reject.apply(this, arguments);
        });
        return deferred.promise;
      }

    };
  }]);
