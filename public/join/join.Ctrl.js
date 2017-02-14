(function() {
  'use strict';

  angular
    .module('app')
    .controller('JoinCtrl', JoinCtrl);

  JoinCtrl.$inject = ['$location', '$scope', '$localStorage', 'socket'];

  function JoinCtrl($location, $scope, $localStorage, socket) {
      var nickname = "";
      $scope.name = "";
      $scope.join = function(){
          nickname = $scope.name;
          $localStorage.nickname = $scope.name;

          socket.emit('join', {nickname: nickname});

          $location.path('/main');
      };
  }
})();