/**
 * Module dependencies & basic instantiation
 */
var GameCollection = require('./lib/GameCollection.js');
var express = require('express');

//create http server
var app = module.exports = express.createServer();
app.listen(8000);

// HTTP Configuration
app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

//create socket io server
var io = require('socket.io').listen(app);
io.set('log level', 1)


var games = new GameCollection(io);
//bind the possible events
io.sockets.on('connection', function (socket) {
  
  //when a player requests to create a new game
  socket.on('create game', function(data) {
    games.createGame({playerId: socket.id, data: data});
  });
  
  //when a player requests to join a game
  socket.on('join game', function(data) {
    games.joinGame({playerId: socket.id, data: data});
  });
  
  //when a player requests to join a game
  socket.on('forfit game', function(data) {
    games.forfitGame({playerId: socket.id, data: data});
  });
});


