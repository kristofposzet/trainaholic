const express = require('express'),
  morgan = require('morgan'),
  exercises = require('./exercises'),
  users = require('./users'),
  trainingPlans = require('./trainingPlans'),
  personsNearby = require('./personsNearby'),
  clients = require('./clients'),
  profile = require('./profile'),
  home = require('./home');

const router = express.Router();

router.use(morgan('tiny')); // naplozza a kereseket
router.use(express.json());
router.use('/', exercises);
router.use('/', users);
router.use('/', trainingPlans);
router.use('/', personsNearby);
router.use('/', clients);
router.use('/', profile);
router.use('/', home);

module.exports = router;
