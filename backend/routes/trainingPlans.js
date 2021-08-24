const express = require('express'),
  service = require('../service/trainingPlanService'),
  validate = require('../validations/validateTrainingPlans'),
  authHandler = require('../userStatus/auth'),
  mapper = require('../mappings/trainingPlansMapper');

const router = express.Router();

router.post('/trainingPlans', authHandler.hasCoachPermission, validate.handleTrainingPlans, async (req, res) => {
  const exerciseList = req.body.exercises;
  const {
    trainingDate, trainingPlanName, selectedImage, userName,
  } = req.body;
  const trainingPlanData = {
    exerciseList, trainingDate, trainingPlanName, selectedImage,
  };
  const response = await service.postTrainingPlan(userName, trainingPlanData);
  res.status(response.status).send(response.message);
});

// ide nem szukseges middleware, mert a service-ben kerem le az infokat a cookie-bol
router.get('/trainingPlans', async (req, res) => {
  const pageNo  = +(req.url).split('=').pop();
  const response = await service.getTrainingPlans(req, res, pageNo);
  res.status(response.status).json(response.message);
});

router.get('/trainingPlans/:id', authHandler.hasCoachPermission, authHandler.trainingPlanBelongsToCoach, async (req, res) => {
  const { id } = req.params;
  const response = await service.getTrainingPlan(id);
  res.status(response.status).json(mapper.mapTrainingPlanToDto(response.message));
});

router.get('/trainingPlans/client/:userName', authHandler.hasCoachPermission, async (req, res) => {
  const { userName } = req.params;
  const response = await service.getTrainingPlansAttachedToClient(userName);
  res.status(response.status).json(response.message);
});

router.put('/trainingPlans/:id', authHandler.trainingPlanBelongsToCoach, validate.handleTrainingPlans, async (req, res) => {
  const { id } = req.params;
  const exerciseList = req.body.exercises;
  const { trainingDate, trainingPlanName, selectedImage } = req.body;
  const trainingPlanData = {
    exerciseList, trainingDate, trainingPlanName, selectedImage,
  };
  const response = await service.putTrainingPlan(trainingPlanData, id);
  res.status(response.status).send(response.message);
});

router.delete('/trainingPlans/:id', authHandler.hasCoachPermission, async (req, res) => {
  const { id } = req.params;
  res.sendStatus((await service.removeTrainingPlan(id)).status);
});

router.get('/noOfCurrentTrainingPlans', async (req, res) => {
  const response = await service.getNoOfTrainingPlans(req, res);
  res.status(response.status).json(response.message);
});

module.exports = router;
