const express = require('express'),
  service = require('../service/clients'),
  mapper = require('../mappings/clientsMapper'),
  authHandler = require('../userStatus/auth');

const router = express.Router();

router.get('/clients', async (req, res) => {
  const response = await service.getContactedClients(req, res);
  if (response.status === 200) {
    res.status(200).json(response.message.map(
      (client) => (mapper.mapClientsToOutgoingDto(client)),
    ));
  } else {
    res.status(response.status).json(response.message);
  }
});

router.get('/clients/attached/:trainingPlanId', async (req, res) => {
  const { trainingPlanId } = req.params;
  const response = await service.getClientsToAttach(req, res, `TrainingPlan/${trainingPlanId}`);
  res.status(response.status).json(response.message);
});

router.post('/clients/attached/:trainingPlanId/:userName', authHandler.hasCoachPermission, async (req, res) => {
  const { trainingPlanId, userName } = req.params;
  const response = await service.saveAttachment(userName, `TrainingPlan/${trainingPlanId}`);
  res.status(response.status).json(response.message);
});

router.delete('/clients/attached/:trainingPlanId/:userName', authHandler.hasCoachPermission, async (req, res) => {
  const { trainingPlanId, userName } = req.params;
  const response = await service.deleteAttachment(userName, `TrainingPlan/${trainingPlanId}`);
  res.status(response.status).json(response.message);
});

module.exports = router;
