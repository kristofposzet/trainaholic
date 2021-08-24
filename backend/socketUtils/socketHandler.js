const socketUtils = require('./socketUtils'),
  ERR_MSG = require('../types/errorMessages');

exports.handleSockets = (io) => {
  // menedzseljuk azt a socket peldanyt, amely kapcsolodott
  io.on('connection', (socket) => {
    socket.on('join', ({ room, user }, callback) => {
      socketUtils.initRoomIfNotExists(room, user)
        .then((roomName) => {
        // bejoinol egy user-t egy room-ba
          if (roomName !== ERR_MSG.INTERNAL_SERVER_ERROR) {
            socketUtils.getConversationsByRoomName(roomName)
              .then((conversations) => {
                for (let i = 0; i < conversations.length; i += 1) {
                  socket.emit('message', { fromUser: conversations[i].fromUser, text: conversations[i].text });
                }
                socket.join(roomName);
                callback();
              })
              .catch((err) => {
                callback({ errorOccured: err });
              });
          } else {
            callback(ERR_MSG.INTERNAL_SERVER_ERROR);
          }
        })
        .catch(() => {
          callback({ errorOccured: ERR_MSG.INTERNAL_SERVER_ERROR });
        });
    });

    // itt varunk a sendMessage-re, itt a frontend emit-el
    socket.on('sendMessage', (message, payload, callback) => {
    // meg kell mondjuk, h melyik roomba legyen teve a message
      socketUtils.addConversation(payload.roomName, { fromUser: payload.user, text: message  })
        .then(() => {
          io.to(payload.roomName).emit('message', { fromUser: payload.user, text: message });
          callback();
        })
        .catch((err) => callback({ errorOccured: err }));
    });
    socket.on('disconnect', () => {
      console.log(`User with socketId ${socket.id} disconnected.`);
    });
  });
};
