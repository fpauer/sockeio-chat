(function() {
  'use strict';

  angular
    .module('app')
    .factory('socket', socket);

  socket.$inject = ['$rootScope'];

  function socket($rootScope) {
      var socketio = io.connect();

      return {
          on: on,
          emit: emit
      }

      function on(eventName, callback){
          socketio.on(eventName, function(){
              var args = arguments;
              $rootScope.$apply(function(){
                  callback.apply(socketio, args);
              });
          });
      }

      function emit(eventName, data, callback){
          socketio.emit(eventName, data, function(){
              var args = arguments;
              $rootScope.$apply(function(){
                  if (callback) {
                      callback.apply(socketio, args);
                  }
              });
          });
      }

  };
})();