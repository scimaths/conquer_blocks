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

var roundNumber = 1;
var gameBoard;

io.on('connection', socket => {
    console.log(socket.id + " has joined")
    var newUser = new User(socket.id, 'king');
    users.push(newUser);
    io.to(socket.id).emit('userDetails', socket.id)

    if (users.length == 2) {
        gameBoard = new Board(10, 10);
        var player1 = new Player(users[0], 1, 0)
        var player2 = new Player(users[1], 7, 3)
        gameBoard.map[1][0].playerList.push(player1);
        gameBoard.map[7][3].playerList.push(player2);
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
    
    socket.on('moveSubmission', movesForRound => {
        movesOverRounds[roundNumber][socket.id] = movesForRound;
        if (Object.keys(movesOverRounds[roundNumber]).length == 2) {
            for (var user of users) {
                userMoves = movesOverRounds[roundNumber][user.name]

                creationArray = Object.keys(userMoves['playersCreated'])
                creationArray.sort()
                for (var newPlayerID of creationArray) {
                    x = usersMoves['playersCreated'][newPlayerID].x
                    y = usersMoves['playersCreated'][newPlayerID].y
                    var newUserPlayer = new Player(user.name, x, y)
                    gameBoard.map[x][y].playerList.push(newUserPlayer)
                    if (newUserPlayer.id != newPlayerID) {
                        console.log("Assertion Error")
                    }
                }

                movementArray = Object.keys(userMoves['playerMovements'])
                movementArray.sort()
                for (var movementID of movementArrat) {
                    x = usersMoves['playerMovements'][movementID][0]
                    y = usersMoves['playerMovements'][movementID][1]
                    for (var player of user.playerList) {
                        if (player.id == movementID) {
                            player.move_to(x, y, gameBoard)
                        }
                    }
                }
            }

            for (var y=0; y<10; ++y) {
                for (var x=0; x<10; ++x) {
                    gameBoard.map[y][x].processEvent()
                }
            }

            roundNumber += 1
        }
    })
})

server.listen(8000, ()=> console.log('listening on port 8000: http://localhost:'+8000));
