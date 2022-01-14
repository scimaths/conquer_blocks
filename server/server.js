// Setting up socket server
const express = require('express');
const app = express();

const socketio = require('socket.io');
const { User } = require('./user.js')
const { Board } = require('./board.js');

const http = require('http')
const server = http.createServer(app) 

const io = socketio(server, {
    cors : {
        origin : "http://127.0.0.1:5500",
        methods : ["GET", "POST"],
    }
})


// Dictionary containing users
var usersInRoom = {}
var movesOverRounds = {}

var roundNumber = 0;
var gameBoard;

io.on('connection', socket => {
    console.log(socket.id + " has joined")
    usersInRoom[socket.id] = new User(socket.id, 'king');
    io.to(socket.id).emit('userDetails', socket.id)

    if (Object.keys(usersInRoom).length == 2) {
        gameBoard = new Board(10, 10);
        socket.emit('bothPlayersInfo', usersInRoom);
        socket.emit('gameBoardObject', gameBoard);
        console.log('Info sent to both')
    }

    socket.on('disconnect', () => {
        console.log(socket.id + " has left the game")
        delete usersInRoom[socket.id]
    })
    
    socket.on('roundMoveUpdates', movesForRound => {
        roundNumber += 1;
        movesOverRounds[roundNumber] = movesForRound;

    })
})

server.listen(8000, ()=> console.log('listening on port 8000: http://localhost:'+8000));
