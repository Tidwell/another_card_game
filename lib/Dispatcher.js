/*
wrapper to take sets of user session ids and send messages
also a wrapper to send to everyone
does some type cohersion to present a unified API
*/
function Dispatcher(io) {
  this.io = io;

}

//array of user ids (socket.io socket ids really)
//type of message (string)
//message (any data type) (optional)
Dispatcher.prototype.emit = function(users, type, message) {
  var disp = this;
  if (typeof users === 'string') users = [{id: users}]; //make sure its an array
  message = message || {};
  users.forEach(function(user) {
    disp.io.sockets.socket(user.id).emit(type, message);
  });
}

//type of message (string)
//message (any data type) (optional)
Dispatcher.prototype.emitAll = function(type, message) {
  message = message || {};
  this.io.sockets.emit(type, message);
}

exports = module.exports = Dispatcher;