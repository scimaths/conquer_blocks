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

var newUser;

io.on('connection', socket => {
    console.log(socket.id + " has joined")
    if (users.length == 0) {
        newUser = new User(String(socket.id), 'king1');
    }
    else {
        newUser = new User(String(socket.id), 'king2');    
    }
    users.push(newUser);
    io.to(socket.id).emit('userDetails', String(socket.id))

    if (users.length == 2) {
        gameBoard = new Board(10, 10);
        var player1 = new Player(users[0], 5, 5)
        var player2 = new Player(users[1], 4, 5)
        gameBoard.map[5][5].playerList.push(player1);
        gameBoard.map[4][5].playerList.push(player2);
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
            if (String(socket.id) == user.name) {
                users.splice(cnt, 1);
                break;
            }
            cnt += 1;
        }
    })
    
    socket.on('moveSubmission', movesForRound => {
        console.log(socket.id + " has sent submission for " + roundNumber);
        if (!(roundNumber in movesOverRounds)) {
            movesOverRounds[roundNumber] = {}
        }
        movesOverRounds[roundNumber][String(socket.id)] = movesForRound;
        if (Object.keys(movesOverRounds[roundNumber]).length == 2) {
            for (var user of users) {
                var usersMoves = movesOverRounds[roundNumber][user.name]

                if (usersMoves['playersCreated']) {
                    for (var position of usersMoves['playersCreated']) {
                        var x = position[0];
                        var y = position[1]
                        var newUserPlayer = new Player(user, x, y)
                        gameBoard.map[x][y].playerList.push(newUserPlayer)
                    }
                }

                if (usersMoves['playerMovements']) {
                    var movementArray = Object.keys(usersMoves['playerMovements'])
                    movementArray.sort()
                    for (var movementID of movementArray) {
                        var x = usersMoves['playerMovements'][movementID][0]
                        var y = usersMoves['playerMovements'][movementID][1]
                        for (var player of user.playerList) {
                            if (player.id == movementID) {
                                pastPos = player.move_to(x, y)
                                gameBoard.map[x][y].playerList.push(player)
                                var newPastPosList = []
                                for (var oldPlayer of gameBoard.map[pastPos[0]][pastPos[1]].playerList) {
                                    if (!(oldPlayer.id == player.id && oldPlayer.name == player.name)) {
                                        newPastPosList.push(oldPlayer)
                                    }
                                }
                                gameBoard.map[pastPos[0]][pastPos[1]].playerList = newPastPosList;
                            }
                        }
                    }
                }

                user.technology += usersMoves['techInvestment']['value']
                user.iron -= usersMoves['techInvestment']['value']
            }

            for (var y=0; y<10; ++y) {
                for (var x=0; x<10; ++x) {
                    gameBoard.map[y][x].processEvent(users[0], users[1])
                }
            }

            io.emit('refreshBoard', gameBoard, users, roundNumber);
            for (var x = 0; x<10; ++x) {
                for (var y=0; y<10; ++y) {
                    if (gameBoard.map[y][x].playerList.length > 0) {
                        console.log(gameBoard.map[y][x].playerList.length + " players found at " + x + " " + y);
                    }
                }
            }
            console.log("Result sent back for Round " + roundNumber);
            if (roundNumber == 5) {
                var winner;
                if (users[0].diamond > users[1].diamond) {
                    winner = String(users[0].name);
                }
                else if (users[0].diamond < users[1].diamond) {
                    winner = String(users[1].name);
                }
                else {
                    winner = "None";
                }
                io.emit('gameOver', winner);
            }
            roundNumber += 1
        }
    })
})

server.listen(8000, ()=> console.log('listening on port 8000: http://localhost:'+8000));
