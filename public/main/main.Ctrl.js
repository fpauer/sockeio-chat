(function() {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$localStorage', 'socket', 'lodash'];

  function MainCtrl($scope, $localStorage, socket, lodash) {
      $scope.message = '';
      $scope.messages = [];
      $scope.users = [];
      $scope.likes = [];
      $scope.mynickname = $localStorage.nickname;
      var nickname = $scope.mynickname;

      socket.emit('get-users');

      socket.on('all-users', function(data){
          $scope.users = data.filter(function(item){
              return item.nickname !== nickname;
          });
      });

      socket.on('message-received', function(data){
          $scope.messages.push(data);
      });

      socket.on('user-liked', function(data){
          $scope.likes.push(data.from);
      });

      socket.on('show-message', function(data){
          console.log(data);
          $scope.messages.push(data);
      });

      $scope.sendMessage = function (data) {
          var newMessage = {
              message: $scope.message,
              from: $scope.mynickname,
              level: 'public'
          };
          socket.emit('send-message', newMessage);
          $scope.message = '';
      };

      $scope.sendLike = function (user) {
          console.log(user);
          var id = lodash.get(user, 'socketid');
          var likeObj = {
              from: $scope.mynickname,
              like: id,
              level: 'private'
          };
          socket.emit('send-like', likeObj);
          $scope.message = '';
      };

      $scope.joinPrivate = function (data) {
          socket.emit('join-private', {nickname: $scope.mynickname});
      };

      $scope.groupPm = function (data) {
          var newMessage = {
              message: $scope.message,
              from: $scope.mynickname,
              level: 'private'
          };
          socket.emit('private-chat', newMessage);
          $scope.message = '';
      };
  };
})();