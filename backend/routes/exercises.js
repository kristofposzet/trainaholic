const express = require('express'),
  mapper = require('../mappings/exercisesMapper'),
  service = require('../service/exerciseService'),
  authHandler = require('../userStatus/auth');

const router = express.Router();

router.get('/exercises', authHandler.hasCoachPermission, async (req, res) => {
  const response = await service.getExercises(req, res);
  res.status(response.status).json(response.message);
});

router.post('/exercises', authHandler.hasCoachPermission, async (req, res) => {
  const { group } = req.body;
  const exerciseDto = mapper.mapExerciseModelToOutgoingDto(req.body);
  const response = await service.postExercise(req, res, group, exerciseDto);
  res.status(response.status).send(response.message);
});

module.exports = router;
