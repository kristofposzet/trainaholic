const Joi = require('joi');

async function handleTrainingPlans(request, response, next) {
  const schema = Joi.object().keys({
    exerciseName: Joi.string().required(),
    sets: Joi.number().required(),
    reps: Joi.number().required(),
    weight: Joi.number().required(),
    id: Joi.string().required(),
  });
  const schemas = Joi.array().items(schema);
  try {
    await schemas.validateAsync(request.body.exercises);
    return next();
  } catch (err) {
    response.status(400).send(err);
  }
  return false;
}

module.exports = {
  handleTrainingPlans,
};
