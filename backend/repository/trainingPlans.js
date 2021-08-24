const db = require('./config'),
  userRoles = require('../types/userRoles'),
  trainingPlanCollection = db.collection('TrainingPlan'),
  belongsToEdgeCollection = db.collection('BelongsToCoach');

exports.updateTrainingPlan = async (trainingPlanId, data) => trainingPlanCollection.replace(
  trainingPlanId, data,
);

exports.insertTrainingPlan = async (trainingPlan, userId) => {
  const transaction = await db.beginTransaction({
    write: [trainingPlanCollection, belongsToEdgeCollection],
  });

  const from = await transaction.step(() => trainingPlanCollection.save(trainingPlan));
  await transaction.step(() => belongsToEdgeCollection.save({
    _from: from._id,
    _to: userId,
  }));

  await transaction.commit();
  return from;
};

exports.findNoOfTrainingPlansByUId = async (userId, role) => {
  if (role === userRoles.coach) {
    return db.query(
      'RETURN LENGTH(FOR b in BelongsToCoach FILTER b._to == @userId FOR t in TrainingPlan FILTER t._id == b._from RETURN t.exercises)',
      { userId },
    );
  }
  return db.query(
    'RETURN LENGTH(FOR b in BelongsToClient FILTER b._to == @userId FOR t in TrainingPlan FILTER t._id == b._from RETURN t.exercises)',
    { userId },
  );
};

exports.findTrainingPlansByUserId = async (userId, role, offset, count) => {
  if (role === userRoles.coach) {
    return db.query(
      'FOR b in BelongsToCoach FILTER b._to == @userId FOR t in TrainingPlan FILTER t._id == b._from '
      + 'SORT DATE_TIMESTAMP(t.trainingDate.year, t.trainingDate.month, t.trainingDate.day, t.trainingDate.hour, t.trainingDate.minute, 0, 0) '
      + 'LIMIT @offset, @count '
      + ' RETURN { exercises: t.exercises, id: t._key, trainingDate: t.trainingDate, trainingPlanName: t.trainingPlanName, selectedImage: t.selectedImage }',
      { userId, offset, count },
    );
  }
  return db.query(
    'FOR b in BelongsToClient FILTER b._to == @userId FOR t in TrainingPlan FILTER t._id == b._from '
    + 'SORT DATE_TIMESTAMP(t.trainingDate.year, t.trainingDate.month, t.trainingDate.day, t.trainingDate.hour, t.trainingDate.minute, 0, 0) '
    + 'LIMIT @offset, @count '
    + 'RETURN { exercises: t.exercises, id: t._key, trainingDate: t.trainingDate, trainingPlanName: t.trainingPlanName, selectedImage: t.selectedImage }',
    { userId, offset, count },
  );
};

exports.findTrainingPlansForAClient = async (userId) => db.query(
  'FOR b in BelongsToClient FILTER b._to == @userId FOR t in TrainingPlan FILTER t._id == b._from '
  + 'RETURN { exercises: t.exercises, id: t._key, trainingDate: t.trainingDate, trainingPlanName: t.trainingPlanName, selectedImage: t.selectedImage }',
  { userId },
);

exports.findTrainingPlanById = async (trainingPlanId) => trainingPlanCollection.document(
  trainingPlanId,
);

exports.removeTrainingPlan = async (trainingPlanId) => trainingPlanCollection.remove(
  trainingPlanId,
);

exports.trainingPlanBelongsToCoach = async (userId, trainingPlanId) => db.query(
  'RETURN LENGTH(FOR b IN BelongsToCoach FILTER @userId == b._to && @trainingPlanId == b._from RETURN b) != 0',
  { userId, trainingPlanId },
);
