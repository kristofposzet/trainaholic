const db = require('./config'),
  roomCollection = db.collection('Room');

const getRoomByRoomName = async (roomName) => db.query(
  'FOR r in Room FILTER r.roomName == @roomName RETURN r',
  { roomName },
);

exports.getRoomByRoomName = getRoomByRoomName;

// message obj. alakja: { fromUser:..., text: ... }
exports.saveMessage = async (roomName, message) => {
  const document = await getRoomByRoomName(roomName);
  const room = await document.next();
  const [firstName, secName] = roomName.split('_');
  const unreadMsgTo = secName === message.fromUser ? secName : firstName;
  const unreadMsgFrom = firstName === message.fromUser ? secName : firstName;
  if (room) {
    return db.query(
      'LET room = DOCUMENT(@roomId) UPDATE room WITH { conversations: APPEND(room.conversations, @message), '
      + 'unreadMsgTo: @unreadMsgTo, unreadMsgFrom: @unreadMsgFrom } in Room',
      {
        roomId: room._id, message, unreadMsgTo, unreadMsgFrom,
      },
    );
  }
  const newRoom = {
    roomName, conversations: [{ ...message }], unreadMsgTo, unreadMsgFrom,
  };
  return roomCollection.save(newRoom);
};

exports.initRoomIfNotExists = async (roomName, user) => {
  const document = await getRoomByRoomName(roomName);
  const room = await document.next();
  if (!room) {
    const newRoom = {
      roomName, conversations: [], unreadMsgTo: '', unreadMsgFrom: '',
    };
    await roomCollection.save(newRoom);
  } else if (room.unreadMsgTo === user) {
    await roomCollection.update(room._id, { unreadMsgTo: '' });
  }
  return roomName;
};

exports.findUnreadInfosByUserName = async (userName) => db.query(
  'FOR r in Room FILTER r.unreadMsgTo == @userName '
  + 'FOR u in User FILTER u.userName == r.unreadMsgFrom '
  + 'RETURN { firstName: u.firstName, lastName: u.lastName, undreadMsgFrom: r.unreadMsgFrom, room: r.roomName }',
  { userName },
);
