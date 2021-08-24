const express = require('express'),
  service = require('../service/personsNearbyService'),
  authHandler = require('../userStatus/auth'),
  utils = require('../service/utils'),
  mapper = require('../mappings/personsNearbyMapper');

const router = express.Router();

// hallgathat query string nelkuli vagy query string-es utvonalra
router.get('/personsNearby', authHandler.isLoggedIn, async (req, res) => {
  const queryComponent = utils.getQueryParamNamesAndValues((req.url).split('='));
  const response = await service.getOutgoingPersonsNearbyDto(req, res, queryComponent);
  if (response.status === 200) {
    res.status(response.status).json(
      response.message.map((userData) => mapper.mapUncontactedUserModelToDto(userData)),
    );
  } else {
    res.status(response.status).json(response.message);
  }
});

// kapcsolatfelveteli keres kuldese egy felhasznalonak
router.post('/personsNearby/:userName', async (req, res) => {
  const { userName }  = req.params;
  const response = await service.postContactRequest(userName, req, res);
  res.status(response.status).json(response.message);
});

// kapcsolatfelveteli keres jovahagyasa -> modositjuk a meglevo dokumentum tartalmat
router.put('/personsNearby/:userName', async (req, res) => {
  const { userName }  = req.params;
  const response = await service.putContactRequest(userName, req, res);
  res.status(response.status).json(response.message);
});

// kapcsolatfelveteli keres torlese egy felhasznaloval
router.delete('/personsNearby/:userName', async (req, res) => {
  const { userName }  = req.params;
  const response = await service.deleteContactRequest(userName, req, res);
  if (response.status === 204) {
    res.sendStatus(204);
  } else {
    res.status(response.status).json(response.message);
  }
});

router.get('/personsNearby/contactStatus/:userName', async (req, res) => {
  const { userName } = req.params;
  const response = await service.getContactWithDesiredUser(req, res, userName);
  res.status(response.status).json(response.message);
});

router.get('/personsNearby/pending', async (req, res) => {
  const response = await service.getAllUsersWithPendingContact(req, res);
  res.status(response.status).json(response.message);
});

module.exports = router;
