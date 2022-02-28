import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import createGameBoard from './createGameBoard.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');
const ctx = canvas.getContext('2d');
const canvasWidth = (canvas.width = 640);
const canvasHeight = (canvas.height = 480);

let player;
let currentOpponents = [];
let playerRank = 'Rank:   /  ';
let currentCollectible;
let isEmittingCollision = false;

let avatar = {
    width: 40,
    height: 40,
    playerSrc: '/images/token_1.png',
    opponentSrc: '/images/token_2.png',
}
let collectibleSpritesSrc = '/images/Rahmen.png'

const loadSprite = (src) => {
    const sprite = new Image();
    sprite.src = src;
    return sprite;
};
const playerAvatar = loadSprite(avatar.playerSrc);
const opponentAvatar = loadSprite(avatar.opponentSrc);
const collectibleSprites = loadSprite(collectibleSpritesSrc);


socket.on('connect', () => {
    let x = 10
    let y = 10
    player = new Player({
        x,
        y,
        id: socket.id
    });
    socket.emit('newPlayerJoined', player);
});


socket.on('collectible', (collectible) => {

    if (currentCollectible) {
        currentCollectible.setState(collectible);
        isEmittingCollision = false;
    }


    else {
        currentCollectible = new Collectible(collectible);
    }
});

socket.on('scored', (newScore) => {
  player.score = newScore;
  playerRank = player.calculateRank([player, ...currentOpponents]);
});


socket.on('currentOpponents', (opponents) => {
    opponents.forEach((opponent) => {
        currentOpponents.push(new Player(opponent));
    });
  playerRank = player.calculateRank([player, ...currentOpponents]);
});


socket.on('newOpponent', (opponent) => {
    currentOpponents.push(new Player(opponent));
  playerRank = player.calculateRank([player, ...currentOpponents]);
});


socket.on('opponentStateChange', ({
    x,
    y,
    score,
    id,
    dir
}) => {
    const opponent = currentOpponents.find((opponent) => opponent.id === id);
    opponent.x = x;
    opponent.y = y;
    opponent.score = score;
    opponent.dir = dir;
    playerRank = player.calculateRank([player, ...currentOpponents]);
});


socket.on('opponentLeave', (id) => {
    const opponentIndex = currentOpponents.findIndex(
        (opponent) => opponent.id === id
    );
    currentOpponents.splice(opponentIndex, 1);
  playerRank = player.calculateRank([player, ...currentOpponents]);
});


document.addEventListener('keydown', ({
    key
}) => {
    let direction = ''
    switch (key) {

        case 'w':
            direction = 'up';
            break;
        case 's':
            direction = 'down';
            break;
        case 'a':
            direction = 'left';
            break;
        case 'd':
            direction = 'right';
            break;
        default:
            // do nothing
    }
    player.dir = direction
    socket.emit('playerStateChange', player);
});


document.addEventListener('keyup', ({
    key
}) => {
    if (player && (key === 'w' || key === 's' || key === 'a' || key === 'd')) {
        player.dir = null;
        socket.emit('playerStateChange', player);
    }
});


function renderGame() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);


    createGameBoard(ctx, playerRank);

    if (currentCollectible) {
        currentCollectible.draw(ctx, collectibleSprites);
    }





    if (player) {
        player.draw(ctx, playerAvatar);
    }

    for (const opponent of currentOpponents) {
    opponent.draw(ctx, opponentAvatar);
  }


    if (player && currentCollectible) {

        if (player.collision(currentCollectible) && !isEmittingCollision) {
            socket.emit('playerCollideWithCollectible', player);
            // We already notified server, so we don't need to notify again
            isEmittingCollision = true;
        }
    }

    requestAnimationFrame(renderGame);
}
requestAnimationFrame(renderGame);