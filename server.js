require('dotenv').config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socketio = require('socket.io');
const helmet = require('helmet');
const nocache = require('nocache');
const cors = require('cors');
import Collectible from './public/Collectible.mjs';

const {
    playerJoin,
    getPlayers,
    playerLeave,
    setPlayerState,
} = require('./public/playerFunctions');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(
    helmet({
        noSniff: true,
        xssFilter: true,
        hidePoweredBy: {
            setTo: 'PHP 7.4.3',
        },
    })
);
app.use(nocache());

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/images', express.static(process.cwd() + '/images'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({
    origin: '*'
}));

// Index page (static HTML)
app.route('/')
    .get(function(req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
    });

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function(req, res, next) {
    res.status(404)
        .type('text')
        .send('Not Found');
});

// Randomly generate collectible item's position
const playField = {
    width: 624,
    height: 422
}
const collectibleSprite = {
    width: 38,
    height: 18,
    srcs: '/images/Rahmen.png'
}

function generateStartPos(playField, sprite) {
    return {
        x: Math.random() * (playField.width - sprite.width),
        y: Math.random() * (playField.height - sprite.height),
    };
}


const collectiblePos = generateStartPos(playField, collectibleSprite);
// Instantiate a collectible item object
const collectible = new Collectible({
    x: collectiblePos.x,
    y: collectiblePos.y
});

io.on('connection', (socket) => {
    socket.on('newPlayerJoined', (player) => {
        const currentPlayers = getPlayers();
        socket.emit('currentOpponents', currentPlayers);

        socket.emit('collectible', collectible);

        const currentPlayer = playerJoin(player);
        socket.broadcast.emit('newOpponent', currentPlayer);

    });

    socket.on('playerStateChange', (player) => {
        const updatedPlayer = setPlayerState(player);
        socket.broadcast.emit('opponentStateChange', updatedPlayer);
    });

    socket.on('playerCollideWithCollectible', (player) => {
        player.score += 1
    
        socket.emit('scored', player.score);

        const updatedPlayer = setPlayerState(player);
        socket.broadcast.emit('opponentStateChange', updatedPlayer);


        // Generate new position for the collectible item
        let newCollectiblePos = generateStartPos(playField, collectibleSprite);
        // Regenerate the new position if it is the same with the previous
        // position
        while (
            newCollectiblePos.x === collectible.x &&
            newCollectiblePos.y === collectible.y
        ) {
            newCollectiblePos = generateStartPos(playField, collectibleSprite);
        }



        // Update collectible item's state
        collectible.setState({
            x: newCollectiblePos.x,
            y: newCollectiblePos.y,
        });
        // Send the new(updated) collectible item to all clients
        io.sockets.emit('collectible', collectible);
    });

    // Run when player disconnects
  socket.on('disconnect', () => {
    const player = playerLeave(socket.id);
    socket.broadcast.emit('opponentLeave', player.id);
  });

})





const portNum = process.env.PORT || 3000;

// Set up server and tests
server.listen(portNum, () => {
    console.log(`Listening on port ${portNum}`);
    if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function() {
            try {
                runner.run();
            } catch (error) {
                console.log('Tests are not valid:');
                console.error(error);
            }
        }, 1500);
    }
});

module.exports = server; // For testing