const express = require('express'),
  service = require('../service/homeService'),
  mapper = require('../mappings/homeMapper');

const router = express.Router();

router.get('/home/clients', async (req, res) => {
  const response = await service.getContactedUsers(req, res);
  if (response.status === 200) {
    res.status(200).json(
      response.message.map((user) => mapper.mapUserModelToOutgoingDto(user)),
    );
  } else {
    res.status(response.status).json(response.message);
  }
});

module.exports = router;
