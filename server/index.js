const crosswordDataUtils = require('./crosswordDataUtils.js');

const express = require("express");
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173"
	}
});

server.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});

app.get('/api/getGameId', function(req, res) {
	res.json({id: uuidv4()});
});

app.get('/api/getCrosswordData', function(req, res) {
	const url = crosswordDataUtils.getUrl();
	crosswordDataUtils.getDataString(url).then((dataString) => {
		const crosswordData = crosswordDataUtils.getCrosswordData(dataString);
		res.json({crosswordData: crosswordData});
	}).catch(console.dir);
});

// Socket.io setup
io.on('connection', (socket) => {
	console.log('A user connected');

	const gameId = socket.request._query['gameId'];
	console.log('Game id: ' + gameId);
	socket.join(gameId);

	let playerNumber = "player3";

	if (io.sockets.adapter.rooms.get(gameId)) {
		const numPlayers = io.sockets.adapter.rooms.get(gameId).size;
		console.log("Players: " + numPlayers);

		if (numPlayers < 3) {
			playerNumber = "player" + numPlayers;
		}
	}

	socket.emit('getPlayerNumber', playerNumber);

	socket.on('playerMove', (message) => {
		socket.to(gameId).emit('playerMove', {
			playerNumber: playerNumber,
			playerState: {
				...message.playerState,
				isActive: true
			}
		});
	});

	socket.on('input', (message) => {
		socket.to(gameId).emit('input', message);
	});

	socket.on('revealWord', (message) => {
		socket.to(gameId).emit('revealWord', message);
	});

	socket.on('revealGrid', (message) => {
		socket.to(gameId).emit('revealGrid', message);
	});
  
	socket.on('disconnect', () => {
	  console.log('A user disconnected');
	  socket.to(gameId).emit('playerDisconnect', playerNumber);
	});
});