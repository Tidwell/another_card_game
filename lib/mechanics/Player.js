/*
Player object, retains data relevant to the player and logic for actions they would perform
obj {
  id: Number (int)x - socket.io socket.id
}
*/
function Player(obj) {
  this.id = obj.id || undefined;

}

exports = module.exports = Player;