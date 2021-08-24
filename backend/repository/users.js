const db = require('./config'),
  USER_ROLES = require('../types/userRoles');

const userCollection = db.collection('User'),
  locatedInCollection = db.collection('LocatedIn'),
  paysAttentionCollection = db.collection('PaysAttention'),
  trainingPlanCollection = db.collection('TrainingPlan'),
  belongsToCoachCollection = db.collection('BelongsToCoach'),
  belongsToClientCollection = db.collection('BelongsToClient');

// azert kell a return new, hogy gyozodjek meg rola, valoban beszurta-e
exports.insertRefreshToken = (refreshToken, userName) => db.query(
  'FOR u in User FILTER u.userName == @userName update u WITH { refreshToken: @token } IN User RETURN NEW', { userName, token: refreshToken },
);

exports.findPasswordByUserName = (userName, role) => db.query(
  'FOR u in User FILTER u.userName == @userName AND u.role == @role RETURN u.password',
  { userName, role },
);

exports.findRefreshTokenByUserName = (userName) => db.query(
  'FOR u in User FILTER u.userName == @userName RETURN u.refreshToken',
  { userName },
);

exports.numberOfUsersByUserName = (userName) => db.query(
  'RETURN COUNT(FOR u IN User FILTER u.userName == @userName RETURN 1)',
  { userName },
);

exports.findUserByUserName = (userName) => db.query(
  'FOR u in User FILTER u.userName == @userName RETURN u',
  { userName },
);

exports.findRoleByUserName = (userName) => db.query(
  'FOR u in User FILTER u.userName == @userName RETURN u.role',
  { userName },
);

exports.insertUser = async (localityId, user) => {
  const transaction = await db.beginTransaction({
    write: [userCollection, locatedInCollection],
  });
  const userDocument = await transaction.step(() => userCollection.save(user));

  await transaction.step(() => locatedInCollection.save({
    _from: userDocument._id,
    _to: localityId,
  }));

  await transaction.commit();
  return userDocument;
};

// ha meg nem volt beszurva kep attributum, beszurja, kulonben modositja a meglevot
exports.upsertPath = async (id, path) => db.query(
  'UPSERT { _id: @id } INSERT { imagePath: @path } UPDATE { imagePath: @path } IN User RETURN NEW.imagePath',
  { id, path },
);

exports.updateUserData = async (id, personalData) => userCollection.update(id, personalData);

exports.findAllUsers = async (offset, count) => db.query(
  'FOR u in User FILTER u.role != 3 SORT u.firstName LIMIT @offset, @count RETURN u',
  { offset, count },
);

exports.getNoOfAllUsers = async () => db.query('RETURN LENGTH(FOR u in User FILTER u.role != 3 RETURN u)');

exports.deleteUser = async (userId, role) => {
  const transaction = await db.beginTransaction({
    write: [userCollection, locatedInCollection, paysAttentionCollection, trainingPlanCollection,
      belongsToClientCollection, belongsToCoachCollection],
  });

  await transaction.step(() => userCollection.remove(userId));
  const locatedInDoc = await db.query(
    'FOR l in LocatedIn FILTER l._from == @userId RETURN l._id',
    { userId },
  );
  const locatedInId = await locatedInDoc.next();
  await transaction.step(() => locatedInCollection.remove(locatedInId));

  const allContactedUsersDoc = await db.query(
    'FOR p in PaysAttention FILTER @role == 2 ? p._from == @userId : p._to == @userId RETURN p._id', { userId, role },
  );
  const allContectedUserIds = await allContactedUsersDoc.all();
  await paysAttentionCollection.removeAll(allContectedUserIds);

  const allAttachedTrainingPlansDoc = await db.query(
    role === USER_ROLES.coach ? 'FOR b in BelongsToCoach FILTER b._to == @userId RETURN { trainingPlanId: b._from, bId: b._id }'
      : 'FOR b in BelongsToClient FILTER b._to == @userId RETURN { trainingPlanId: b._from, bId: b._id }',
    { userId },
  );
  const trainingPlansDoc = await allAttachedTrainingPlansDoc.all();
  const trainingPlanIds = trainingPlansDoc.map((doc) => (doc.trainingPlanId));
  const bIds = trainingPlansDoc.map((doc) => (doc.bId));
  await transaction.step(() => trainingPlanCollection.removeAll(trainingPlanIds));
  if (role === USER_ROLES.coach) {
    await transaction.step(() => belongsToCoachCollection.removeAll(bIds));
  } else {
    await transaction.step(() => belongsToClientCollection.removeAll(bIds));
  }
  await transaction.commit();
};
