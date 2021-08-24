const Joi = require('joi');

async function handleRegister(request, response, next) {
  const schema = Joi.object().keys({
    userName: Joi.string().required().regex(/(?=.*?[a-z])/).min(4)
      .max(20),
    firstName: Joi.string().required().regex(/^[A-ZÁÉÍÚÜŐŰ][a-záéúíóüőű]+$/).max(20),
    lastName: Joi.string().required().regex(/^[A-ZÁÉÍÚÜŐŰ][a-záéúíóüőű]+$/).max(30),
    password: Joi.string().required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/).max(30),
    country: Joi.string().required(),
    region: Joi.string().required(),
    city: Joi.string().required(),
    role: Joi.number().min(1).max(2).required(),
    gender: Joi.required(),
    email: Joi.string().required().regex(/\S+@\S+\.\S+/),
  });

  try {
    await schema.validateAsync(request.body);
    return next();
  } catch (err) {
    response.status(400).send(err);
    console.log(err);
  }
  return false;
}

async function handleLogin(request, response, next) {
  const schema = Joi.object().keys({
    userName: Joi.string().required().regex(/(?=.*?[a-z])/).min(4)
      .max(20),
    password: Joi.string().required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/).max(30),
    role: Joi.number().min(1).max(3).required(), // 1 - kliens, 2 - coach, 3 - admin
  });

  try {
    await schema.validateAsync(request.body);
    return next();
  } catch (err) {
    response.status(400).send(err);
    console.log(err);
  }
  return false;
}
module.exports = {
  handleRegister,
  handleLogin,
};
