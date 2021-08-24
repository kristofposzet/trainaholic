const dbTrainingPlans = require('../repository/trainingPlans'),
  userService = require('./userService'),
  dbUsers = require('../repository/users'),
  utils = require('./utils');

const getSelectedExercises = (exerciseList) => {
  const exercises = {};
  for (let i = 0; i < exerciseList.length; i += 1) {
    const exerciseId = exerciseList[i].id;
    exercises[i] = {
      exerciseId,
      exerciseName: exerciseList[i].exerciseName,
      sets: +exerciseList[i].sets,
      reps: +exerciseList[i].reps,
      weight: +exerciseList[i].weight,
    };
  }
  return exercises;
};

exports.postTrainingPlan = async (userName, data) => {
  const trainingPlanData = {
    exercises: getSelectedExercises(data.exerciseList),
    trainingDate: data.trainingDate,
    trainingPlanName: data.trainingPlanName,
    selectedImage: data.selectedImage,
  };
  try {
    const cursor = await dbUsers.findUserByUserName(userName);
    const user = await cursor.next();
    // eslint-disable-next-line no-underscore-dangle
    const key = (await dbTrainingPlans.insertTrainingPlan(trainingPlanData, user._id))._key;
    // post utan szuksegem lesz a kulcsra, mert lehet redirect-elni szeretnek arra az oldalra, ahol
    // a training plan kulcsa szerint csatolok majd klienseket ahhoz az edzestervhez
    return { status: 201, message: key };
  } catch (err) {
    return { status: 500, message: `Error inserting the new training plan: ${err}` };
  }
};

exports.putTrainingPlan = async (data, id) => {
  try {
    const trainingPlanData = {
      exercises: getSelectedExercises(data.exerciseList),
      trainingDate: data.trainingDate,
      trainingPlanName: data.trainingPlanName,
      selectedImage: data.selectedImage,
    };

    const trainingPlanId = `TrainingPlan/${id}`;
    await dbTrainingPlans.updateTrainingPlan(trainingPlanId, trainingPlanData);
    return { status: 201, message: 'OK' };
  } catch (err) {
    return { status: 500, message: `Error inserting the new training plan: ${err}` };
  }
};

exports.getTrainingPlans = async (req, res, pageNo) => {
  // az url hasonlo alaku: /trainingPlans?page=1
  try {
    const { user, role } = await utils.getUser(req, res);
    let offset = 0;
    const count = 10;
    if (pageNo !== 1) {
      offset = count * pageNo - count;
    }

    const trainingPlansDoc = await dbTrainingPlans.findTrainingPlansByUserId(
      user._id, role, offset, count,
    );
    const trainingPlans = await trainingPlansDoc.all();
    return { status: 200, message: trainingPlans };
  } catch (errorMsg) {
    return { status: 500, message: errorMsg.message };
  }
};

exports.getTrainingPlan = async (id) => {
  // /trainingPlans/:id
  try {
    const trainingPlansDoc = await dbTrainingPlans.findTrainingPlanById(`TrainingPlan/${id}`);
    const trainingPlan = await trainingPlansDoc;
    return { status: 200, message: trainingPlan };
  } catch (errorMsg) {
    return { status: 500, message: errorMsg.message };
  }
};

exports.removeTrainingPlan = async (id) => {
  try {
    await dbTrainingPlans.removeTrainingPlan(`TrainingPlan/${id}`);
    // no content
    return { status: 204 };
  } catch (errorMsg) {
    return { status: 400, message: errorMsg.message };
  }
};

exports.getNoOfTrainingPlans = async (req, res) => {
  try {
    const userInformations = await userService.introspect(req, res);
    const userName = userInformations.message.user;
    const { role } = userInformations.message;
    const userDocument = await dbUsers.findUserByUserName(userName);
    const user = await userDocument.next();
    const trainingPlanDoc = await dbTrainingPlans.findNoOfTrainingPlansByUId(user._id, role);
    const noOfCurrentTrainingPlans = await trainingPlanDoc.next();
    return { status: 200, message: noOfCurrentTrainingPlans };
  } catch (errorMsg) {
    return { status: 500, message: 'Error - no of training plans' };
  }
};

exports.getTrainingPlansAttachedToClient = async (userName) => {
  try {
    const userDocument = await dbUsers.findUserByUserName(userName);
    const user = await userDocument.next();
    const trainingPlanDoc = await dbTrainingPlans.findTrainingPlansForAClient(user._id);
    const trainingPlans = await trainingPlanDoc.all();
    return { status: 200, message: trainingPlans };
  } catch (err) {
    return { status: 500, message: 'Internal server error' };
  }
};
