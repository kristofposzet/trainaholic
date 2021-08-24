const dbExerciseType = require('../repository/exerciseTypes'),
  dbExercise = require('../repository/exercises'),
  utils = require('./utils');

exports.postExercise = async (req, res, group, exerciseDto) => {
  try {
    const { user } = await utils.getUser(req, res);
    const exerciseTypeCursor = await dbExerciseType.findExerciseTypeByGroup(group);
    const exerciseTypeId = await exerciseTypeCursor.next();
    if (exerciseTypeId === null || exerciseTypeId === undefined) {
      return { status: 404, message: 'Exercise type not found' };
    }
    const newExerciseDto = { ...exerciseDto, userId: user._id };
    await dbExercise.insertExercise(exerciseTypeId, newExerciseDto);
    return { status: 201, message: 'OKES' };
  } catch (err) {
    return { status: 500, message: `Error while creating exercise. ${err.message}` };
  }
};

exports.getExercises = async (req, res) => {
  try {
    const { user } = await utils.getUser(req, res);
    const exercisesDoc = await dbExercise.findAllExercises(user._id);
    const exercises = await exercisesDoc.all();
    return { status: 200, message: exercises };
  } catch (err) {
    return { status: 500, message: `Error while getting exercise. ${err.message}` };
  }
};
