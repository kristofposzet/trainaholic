const dbRoom = require('../repository/room'),
  ERR_MSG = require('../types/errorMessages');

exports.addConversation = async (roomName, message) => {
  try {
    await dbRoom.saveMessage(roomName, message);
    return { message: 'OK' };
  } catch (err) {
    return { message: ERR_MSG.INTERNAL_SERVER_ERROR };
  }
};

exports.initRoomIfNotExists = async (roomName, user) => {
  try {
    const roomNameDb = await dbRoom.initRoomIfNotExists(roomName, user);
    return roomNameDb;
  } catch (err) {
    return ERR_MSG.INTERNAL_SERVER_ERROR;
  }
};

exports.getConversationsByRoomName = async (roomName) => {
  try {
    const document = await dbRoom.getRoomByRoomName(roomName);
    const room = await document.next();
    return room.conversations;
  } catch (err) {
    return ERR_MSG.INTERNAL_SERVER_ERROR;
  }
};
