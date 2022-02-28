const players = [];

function playerJoin(player) {
  players.push(player);
  return player;
}

function setPlayerState({ x, y, id, dir, score }) {
  const player = players.find((p) => p.id === id);
  player.x = x;
  player.y = y;
  player.dir = dir;
  player.score = score;
  return player;
}

function playerLeave(id) {
  const playerIndex = players.findIndex((player) => player.id === id);
  return players.splice(playerIndex, 1)[0];
}

function getPlayers() {
  return players;
}

module.exports = {
  playerJoin,
  setPlayerState,
  playerLeave,
  getPlayers,
};