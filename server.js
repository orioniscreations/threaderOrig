const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
const users = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//  Set static folder:
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'Threader';

// run when a client connects:
io.on('connection', socket => {

  socket.on('joinRoom', ({
    username,
    room
  }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // broadcast to the user that they connected
    socket.emit('message', formatMessage(botName, 'Welcome to Threader!'));

    // send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })

    // broadcast to everyone but the user that is connecting that a user connected:
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, ` ${user.username} has joined the Thread!`));
  });



  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));

  });

  // when client disconnects:
  socket.on('disconnect', () => {
    // what user left
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `Hiatus! ${user.username} has left the Thread`));


    };


  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log('Surver running on port ' + PORT));