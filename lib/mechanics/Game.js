var Player = require('./Player');
var Dispatcher = require('./../Dispatcher');

function Game(io) {
  this.id = 0;
  this.name = '';
  this.players = [];
  this.maxPlayers = 2; 
  this.active = false;
  this.dispatcher = new Dispatcher(io);
}

Game.prototype.setName = function(name) {
  this.name = name;
}
Game.prototype.setId = function(id) {
  this.id = id;
}
Game.prototype.addPlayer = function(obj) {
  var newPlayer = new Player(obj);
  this.players.push(newPlayer);
  this.checkReady();
}
Game.prototype.checkReady = function() {
  if (this.players.length == this.maxPlayers) {
    this.startGame();
  }
}
Game.prototype.startGame = function() {
  this.active = true;
  this.dispatcher.emit(this.players, 'game started');
}
Game.prototype.forfit = function(obj) {
  this.active = false;
  this.dispatcher.emit(this.players, 'game ended');
}
exports = module.exports = Game;



/*
Players start with 40 control
Reduce opponents control to 0
5 locations on board

Characters, Items, Effects, Instants
Standard Stack

Control, Deploy, Fight>(effects, calculate, resolve), Move, End

Characters have:
Power, Defense, Attrition, Destiny

3 characters needed to draw destiny


*/