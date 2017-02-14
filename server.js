var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 8080;
var users = [];

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', function(socket) {
    console.log('new connection made');

    // SHow all users when first logged on

    socket.on('get-users', function(){
        socket.emit('all-users', users);
    });

    // When new socket joins
    socket.on('join', function(data){
        console.log(data);
        console.log(users);
        socket.nickname = data.nickname;
        users[socket.nickname] = socket;
        var userObj = {
            nickname: data.nickname,
            socketid: socket.id
        };
        users.push(userObj);
        io.emit('all-users', users); // emit to all users
    });

    // Broadcast the message
    socket.on('send-message', function(data){
        io.emit('message-received', data);
    });

    // Send like to the user
    socket.on('send-like', function(data){
        socket.broadcast.to(data.like).emit('user-liked', data);
    });

    socket.on('join-private', function(data){
        socket.join('private');
        console.log(data.nickname, 'joined private');
    });

    socket.on('private-chat', function(data){
        io.sockets.in('private').emit('show-message', data);
    });

    socket.on('disconnect', function(data) {
        console.log('disconnected', socket.nickname);
        users = users.filter(function(item){
            return item.nickname !== socket.nickname;
        });
        io.emit('all-users', users); // emit to all users
    });
});

server.listen(port, function() {
    console.log("Listening on port " + port);
});