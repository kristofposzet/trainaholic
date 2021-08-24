const dbUsers = require('../repository/users'),
  dbLocalities = require('../repository/localities'),
  dbCountries = require('../repository/countries'),
  dbProfile = require('../repository/profile'),
  dbRoom = require('../repository/room'),
  mapper = require('../mappings/profileMapper'),
  utils = require('./utils');

exports.getProfileByUserName = async (userName) => {
  try {
    const userDoc = await dbUsers.findUserByUserName(userName);
    const user = await userDoc.next();
    const localityDoc = await dbLocalities.getLocalityByUserId(user._id);
    const locality = await localityDoc.next();
    const countryDoc = await dbCountries.getCountryNameByLocalityId(locality.localityId);
    const country = await countryDoc.next();
    return { status: 200, message: mapper.mapModelsToOutgoingProfileDto(user, country, locality) };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

exports.postComment = async (req, res, userNameTo) => {
  try {
    const userFrom = (await utils.getUser(req, res)).user;
    const { comment, creationDate } = req.body;
    const userToDocument = await dbUsers.findUserByUserName(userNameTo);
    const userTo = await userToDocument.next();
    const commentObj = {
      commentId: `${(Math.random() * 0xfffff * 1000000).toString(16)}_${userTo.userName}`,
      comment,
      creationDate,
      from: {
        userName: userFrom.userName,
        firstName: userFrom.firstName,
        lastName: userFrom.lastName,
      },
    };
    await dbProfile.saveComment(userTo._id, commentObj, userTo.comments);
    return { status: 200, message: commentObj };
  } catch (err) {
    return { status: 400, message: err.message };
  }
};

exports.deleteComment = async (req, res, commentId, userName) => {
  try {
    const { user } = await utils.getUser(req, res);
    const forUserDoc = await dbUsers.findUserByUserName(userName);
    const forUser = await forUserDoc.next();
    await dbProfile.deleteComment(forUser._id, commentId, user.userName);
    return { status: 204, message: '' };
  } catch (err) {
    return { status: 400, message: err.message };
  }
};

exports.findUnreadInfosByUserName = async (req, res) => {
  try {
    const { user } = await utils.getUser(req, res);
    const roomDoc = await dbRoom.findUnreadInfosByUserName(user.userName);
    const unreadInfos = await roomDoc.all();
    return {
      status: 200,
      message: { unreadInfos },
    };
  } catch (err) {
    return { status: 400, message: err.message };
  }
};
