const socketio = require('socket.io')
const formatMessage = require('../utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('../utils/users');
const users = require('../utils/users');

const Message = require('./model/Message')

var io = null;


module.exports = (server) => {
  io = socketio(server)
  const botName = 'Threader';

  // run when a client connects:
  io.on('connection', socket => {

    socket.on('joinRoom', async ({
      username,
      room
    }) => {
      const user = userJoin(socket.id, username, room);

      socket.join(user.room);

      let messages = await Message.find({
        username: user.username
      })
      let m = messages[0]

      m.content = m.content.toUpperCase()
      await m.save()

      socket.emit("msglist", messages)

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
    socket.on('chatMessage', async msg => {
      const user = getCurrentUser(socket.id);
      var dbMessage = new Message({
        room: user.room,
        username: user.username,
        content: msg
      })
      await dbMessage.save()
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
}