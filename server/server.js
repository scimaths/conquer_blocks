// Setting up socket server
const express = require('express');
const app = express();

const socketio = require('socket.io');
const { User } = require('./user.js')
const { Board } = require('./board.js');
const { Player } = require('./player.js');

const http = require('http')
const server = http.createServer(app) 

const io = socketio(server, {
    cors : {
        origin : "http://127.0.0.1:5501",
        methods : ["GET", "POST"],
    }
})


// Dictionary containing users
var users = []
var movesOverRounds = {}

var roundNumber = 0;
var gameBoard;

io.on('connection', socket => {
    console.log(socket.id + " has joined")
    var newUser = new User(socket.id, 'king');
    users.push(newUser);
    io.to(socket.id).emit('userDetails', socket.id)

    if (users.length == 2) {
        gameBoard = new Board(10, 10);
        var player1 = new Player(users[0], 0, 0)
        var player2 = new Player(users[1], 9, 0)
        
        io.emit('bothPlayersInfo', users);
        
        console.log('Info sent to both')
    }

    socket.on('ready', value => {
        if (users.length == 2) {
            io.emit('gameBoardObject', gameBoard);
        }
    })

    socket.on('disconnect', () => {
        console.log(socket.id + " has left the game")
        cnt = 0;
        for (let user of users) {
            if (socket.id == user.name) {
                users.splice(cnt, 1);
                break;
            }
            cnt += 1;
        }
    })
    
    socket.on('roundMoveUpdates', movesForRound => {
        roundNumber += 1;
        movesOverRounds[roundNumber] = movesForRound;
    })
})

server.listen(8000, ()=> console.log('listening on port 8000: http://localhost:'+8000));
