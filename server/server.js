const express = require('express');
const app = express();

const {User} = require('./user.js')

const http = require('http')
const server = http.createServer(app) 

const socketio = require('socket.io')

const io = socketio(server, {
    cors : {
        origin : "http://127.0.0.1:5500",
        methods : ["GET", "POST"],
    }
})

var usersInRoom = {}

io.on('connection', socket=> {
    console.log(socket.id)
    usersInRoom[socket.id] = new User(socket.id, 'king');
    io.to(socket.id).emit('userDetails', usersInRoom[socket.id])

    socket.on('update', input => {
        console.log(input)
    })
})

server.listen(8000, ()=> console.log('listening on port 8000: http://localhost:'+8000));
