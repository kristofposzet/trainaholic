const db = require('./config'),
  USER_ROLES = require('../types/userRoles');

const paysAttentionCollection = db.collection('PaysAttention');

exports.findInfosByShortestDistance = async (latitude, longitude, distance) => db.query(
  'FOR loc in Locality\n LET dist = DISTANCE(loc.latitude, loc.longitude, @latitude, @longitude)\n'
  + 'FILTER dist < @distance\n FOR located in LocatedIn\n FILTER loc._id == located._to\n'
  + 'RETURN { distance: dist, latitude: loc.latitude, longitude: loc.longitude, localityId: located._to, userId: located._from, '
  + 'cityName: loc.cityName, userId: located._from }',
  { latitude, longitude, distance },
);

exports.findInfosByName = async (latitude, longitude, nameFirst, nameSecond) => db.query(
  'FOR u in User '
  + 'FILTER u.firstName == @nameFirst && u.lastName == @nameSecond || u.lastName == @nameFirst && u.firstName == @nameSecond\n'
  + 'FOR loc in Locality '
  + 'LET dist = DISTANCE(loc.latitude, loc.longitude, @latitude, @longitude) '
  + 'FOR located in LocatedIn FILTER loc._id == located._to && located._from == u._id '
  + 'RETURN { distance: dist, latitude: loc.latitude, longitude: loc.longitude, localityId: located._to, '
  + 'userId: located._from, cityName: loc.cityName, userId: located._from }',
  {
    latitude, longitude, nameFirst, nameSecond,
  },
);
exports.findCoordinatesAndRoleByUserName = async (userName) => db.query(
  'FOR u in User FILTER u.userName == @userName FOR loc in LocatedIn FILTER loc._from == u._id\n'
  + 'FOR locality in Locality FILTER loc._to == locality._id\n'
  + 'RETURN { latitude: locality.latitude, longitude: locality.longitude, role: u.role }',
  { userName },
);

const relationBetweenUsers = async (_from, _to) => db.query(
  'FOR p IN PaysAttention FILTER @_from == p._from && @_to == p._to RETURN p',
  { _from, _to },
);

exports.contactBetweenUsers = relationBetweenUsers;

exports.saveContactBetweenUsers = async (_from, _to, contact) => {
  const document = await relationBetweenUsers(_from, _to);
  const paysAttention = await document.next();
  if (paysAttention) {
    return paysAttentionCollection.update(paysAttention._id, { contact });
  }
  return paysAttentionCollection.save({ _from, _to, contact });
};

exports.deleteContactBetweenUsers = async (id) => paysAttentionCollection.remove(id);

exports.getAllUsersWithPendingContact = async (id, role, userName) => {
  if (role === USER_ROLES.client) {
    return db.query(
      'FOR p in PaysAttention FILTER p._from == @id && p.contact.contact == \'pending\' && p.contact.requestSentBy != @userName '
      + 'FOR u in User FILTER u.role == @role && u._id == p._to RETURN { '
      + 'userName: u.userName, firstName: u.firstName, lastName: u.lastName }',
      { id, role, userName },
    );
  }
  return db.query(
    'FOR p in PaysAttention FILTER p._to == @id && p.contact.contact == \'pending\' && p.contact.requestSentBy != @userName '
    + 'FOR u in User FILTER u.role == @role && u._id == p._from RETURN { '
    + 'userName: u.userName, firstName: u.firstName, lastName: u.lastName }',
    { id, role, userName },
  );
};

exports.findOutgoingDataByUserIds = (informationArr, role) => db.query(
  'FOR u IN User\n'
  + 'FOR information IN @informationArr FILTER u._id == information.userId && u.role == @role\n'
  + 'RETURN { latitude: information.latitude, longitude: information.longitude, '
  + 'distance: information.distance, firstName: u.firstName, lastName: u.lastName, email: u.email, gender: u.gender, '
  + ' userName: u.userName, phoneNumber: u.phoneNumber, cityName: information.cityName, userId: u._id }',
  { informationArr, role },
);

exports.getAllUncontactedUsers = async (informationArr, role, userID) => db.query(
  'FOR information IN @informationArr '
  + 'LET isContacted = ( '
  + 'FOR p in PaysAttention '
  + 'FILTER (@role == 2) ? p._from == @userID && p._to == information.userId && p.contact.contact == \'contacted\' : '
  + 'p._to == @userID && p._from == information.userId && p.contact.contact == \'contacted\' '
  + 'RETURN p '
  + ') FILTER LENGTH(isContacted) == 0 RETURN information ',
  { informationArr, role, userID },
);
