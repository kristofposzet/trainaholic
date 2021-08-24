const db = require('./config');

const exerciseCollection = db.collection('Exercise');
const belongsToCollection = db.collection('BelongsTo');

exports.findAllExercises = (userId) => db.query('FOR e IN Exercise FILTER e.userId == @userId RETURN e', { userId });

exports.insertExercise = async (exerciseTypeId, exerciseObj) => {
  const transaction = await db.beginTransaction({
    write: [exerciseCollection, belongsToCollection],
  });

  const from = await transaction.step(() => exerciseCollection.save(exerciseObj));
  await transaction.step(() => belongsToCollection.save({
    _from: from._id,
    _to: exerciseTypeId,
  }));

  await transaction.commit();
  return from;
};
