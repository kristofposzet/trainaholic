const express = require('express'),
  authHandler = require('../userStatus/auth'),
  service = require('../service/profileService');

const router = express.Router();

router.get('/profile/:userName', authHandler.isLoggedIn, async (req, res) => {
  const { userName } = req.params;
  const response = await service.getProfileByUserName(userName);
  res.status(response.status).json(response.message);
});

router.post('/profile/comments/:userName', async (req, res) => {
  const { userName } = req.params;
  const response = await service.postComment(req, res, userName);
  res.status(response.status).json(response.message);
});

router.delete('/profile/comments/:userName/commented/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { userName } = req.params;
  const response = await service.deleteComment(req, res, commentId, userName);
  res.status(response.status).json(response.message);
});

router.get('/profile/messages/unread', async (req, res) => {
  const response = await service.findUnreadInfosByUserName(req, res);
  res.status(response.status).json(response.message);
});

module.exports = router;
