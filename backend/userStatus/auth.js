const userService = require('../service/userService'),
  dbTrainingPlans = require('../repository/trainingPlans'),
  utils = require('../service/utils'),
  USER_ROLES = require('../types/userRoles');

async function isLoggedIn(request, response, next) {
  const answer = await userService.introspect(request, response);
  if (answer.status === 200) {
    return next();
  }
  response.status(401).send('Unauthorized');
  return false;
}

async function getRole(request, response) {
  const answer = await userService.introspect(request, response);
  if (answer.status === 200) {
    return answer.message.role;
  }
  return 0;
}

async function hasCoachPermission(request, response, next) {
  const role = await getRole(request, response);
  if (role === USER_ROLES.coach) {
    return next();
  }
  response.status(401).send('Unauthorized');
  return false;
}

async function hasClientPermission(request, response, next) {
  const role = await getRole(request, response);
  if (role === USER_ROLES.client) {
    return next();
  }
  response.status(401).send('Unauthorized');
  return false;
}

async function hasAdminPermission(request, response, next) {
  const role = await getRole(request, response);
  if (role === USER_ROLES.admin) {
    return next();
  }
  response.status(401).send('Unauthorized');
  return false;
}

async function trainingPlanBelongsToCoach(request, response, next) {
  const { id } = request.params;
  const { user } = await utils.getUser(request, response);
  const doc = await dbTrainingPlans.trainingPlanBelongsToCoach(user._id, `TrainingPlan/${id}`);
  const belongsToCoach = await doc.next();
  if (belongsToCoach) {
    return next();
  }
  response.status(401).send('Unauthorized');
  return false;
}

module.exports = {
  isLoggedIn,
  hasCoachPermission,
  hasClientPermission,
  hasAdminPermission,
  trainingPlanBelongsToCoach,
};
