/*
Collection of all active games
Handles creating/joining games and related communication logic
*/
var Game = require('./mechanics/Game.js');
var Dispatcher = require('./Dispatcher.js');

function GameCollection(io) {
  this.io = io;
  this.disp = new Dispatcher(io);
  this.games = [];
  this.gameTally = 0;

}


/*
exclusive options, only pass the one you are looking for
passing both results in gameId being tested only
obj {
  gameId: String,
  playerId: String
}
*/

GameCollection.prototype.getGame = function(obj) {
  var foundGame;
  this.games.forEach(function(game){
    if (obj.gameId && game.id === obj.gameId) {
      foundGame = game;
    }
    else if(obj.playerId) {
      game.players.forEach(function(player) {
        if (player.id === obj.playerId) {
          foundGame = game;
        }
      })
    }
  })
  return foundGame;
}


/*
obj.playerId - requestor id
obj.data
*/
GameCollection.prototype.createGame = function(obj) {
  if (this.getGame({playerId: obj.playerId})) { 
    this.disp.emit(obj.playerId, 'already in game'); 
    return;
  }
  var game = new Game(this.io);
  game.addPlayer({id: obj.playerId});
  game.setName('Game '+Math.floor(Math.random()*9999));
  game.setId((this.gameTally++).toString());
  this.games.push(game);
  this.disp.emitAll('game created', {name: game.name, id: game.id});
}

GameCollection.prototype.removeGame = function(obj) {
  var toRemove;
  this.games.forEach(function(game,index) {
    if (game.id === obj.id) {
      toRemove = index;
    }
  });
  if (toRemove) {
    this.games.remove(toRemove);
  }
}

/*
obj.playerId - requestor id
obj.data
*/
GameCollection.prototype.joinGame = function(obj) {
  var data = obj.data;
  if (this.getGame({playerId: obj.playerId})) { 
    this.disp.emit(obj.playerId, 'already in game'); 
    return;
  }
  var game = this.getGame({gameId: data.id});
  game.addPlayer({id: obj.playerId});
  if (game.active) {
    this.disp.emitAll('game full', {name: game.name, id: game.id});
  }
}

GameCollection.prototype.forfitGame = function(obj) {
  var game = this.getGame({playerId: obj.playerId});
  if (game) {
    game.forfit({playerId: obj.playerId});
    this.removeGame(game);
  }
}



exports = module.exports = GameCollection;



// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};