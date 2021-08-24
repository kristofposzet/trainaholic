const db = require('./config'),
  exerciseGroup = require('../types/exerciseGroup');

const exerciseTypeCollection = db.collection('ExerciseType');

exports.findExerciseTypeByGroup = (group) => db.query(
  'FOR et in ExerciseType FILTER et.group == @group RETURN et._id',
  { group },
);

const initExerciseTypeCollection = async () => {
  const noOfDocuments = (await exerciseTypeCollection.count()).count;
  // ha nincs adat tarolva meg az Exercise collectionben, akkor inicializalom
  if (noOfDocuments === 0) {
    // bejarom a modell "enumot"
    Object.entries(exerciseGroup).forEach(async (entry) => {
      const transaction = await db.beginTransaction({
        write: [exerciseTypeCollection],
      });
      await transaction.step(() => exerciseTypeCollection.save({ group: entry[1] }));
      await transaction.commit();
    });
  }
};

initExerciseTypeCollection();
