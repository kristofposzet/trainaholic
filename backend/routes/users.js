const express = require('express'),
  // https://www.npmjs.com/package/multer
  multer = require('multer'),
  path = require('path'),
  service = require('../service/userService'),
  validateUsers = require('../validations/validateUsers'),
  authHandler = require('../userStatus/auth');

const { mapModelForAdminToOutgoingDto, mapUserToHomePageOutgoingDto } = require('../mappings/userMapper');

const router = express.Router();
const FIELD_NAME = 'profileImg';

// egy stratégia képek tárolására: generálunk neki egy új nevet és eltároljuk kiterjesztéssel együtt
const storageStrategy = multer.diskStorage({
  destination: async (req, file, callbackDestination) => {
    callbackDestination(null, './static/transmittedImages/');
  },
  filename: (req, file, callbackFileName) => {
    callbackFileName(null, `${(Math.random() * 0xfffff * 1000000).toString(16)}_${file.originalname}`);
  },
});
// a multer hasonlít a bodyParser-hez, csak ez multipart/form-data-t "parse"-ol,
// s nem JSON formátumú body-kat
const uploadImg = multer({ storage: storageStrategy });

router.post('/users', validateUsers.handleRegister, async (req, res) => {
  const user = req.body;
  const response = await service.submitUser(user);
  res.status(response.status).json(response.message);
});

router.get('/users/personalInformations', async (req, res) => {
  const response = await service.getPersonalInformations(req, res);
  res.status(response.status).json(response.message);
});

router.get('/users', authHandler.hasAdminPermission, async (req, res) => {
  const pageNo  = +(req.url).split('=').pop();
  const response = await service.getAllUsers(pageNo);
  if (response.status === 200) {
    res.status(200).json({
      users: response.message.allUsers.map((user) => mapModelForAdminToOutgoingDto(user)),
    });
  } else {
    res.status(response.status).json(response.message);
  }
});

router.get('/users/current', authHandler.isLoggedIn, async (req, res) => {
  const response = await service.getCurrentUser(req, res);
  if (response.status === 200) {
    res.status(200).json(mapUserToHomePageOutgoingDto(response.message));
  } else {
    res.status(res.status).json(response.message);
  }
});

router.get('/users/count', authHandler.hasAdminPermission, async (req, res) => {
  const response = await service.getNoOfUsers();
  if (response.status === 200) {
    res.status(200).json({
      noOfAllUsers: response.message.noOfAllUsers,
    });
  } else {
    res.status(response.status).json(response.message);
  }
});

router.delete('/users/:userName', authHandler.hasAdminPermission, async (req, res) => {
  const { userName } = req.params;
  const response = await service.deleteUser(userName);
  res.status(response.status).json(response.message);
});

router.post('/login', validateUsers.handleLogin, async (req, res) => {
  const { userName, password, role } = req.body;
  const response = await service.login(userName, password, role);
  if (response.status === 200) {
    res.cookie('accesToken', response.accesToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refreshToken', response.refreshToken, { httpOnly: true, sameSite: 'strict' });
  }
  res.status(response.status).json(response.message);
});

router.get('/introspect', async (req, res) => {
  const response = await service.introspect(req, res);
  res.status(response.status).json(response.message);
});

// csak akkor tud logout-olni, ha be volt jelentkezve
router.post('/logout', authHandler.isLoggedIn, async (req, res) => {
  const { userName } = req.body;
  const response = await service.logout(userName, res);
  res.status(response.status).json(response.message);
});

// ha meg nem letezik a profilkep, beszurjuk, kulonben modositjuk
router.put('/profilePicture', uploadImg.single(FIELD_NAME), async (req, res) => {
  const response = await service.saveProfilePicture(req, res, req.file.path);
  if (response.status === 200) {
    // ha sikerul a kep mentese, elkuldom valaszkent
    res.status(response.status).sendFile(response.message);
  } else {
    res.status(response.status).send(response.message);
  }
});

router.get('/profilePicture', async (req, res) => {
  // process.cwd(): megadja a working directory-t
  // https://nodejs.org/api/path.html
  const response = await service.getProfilePicture(req, res);
  if (response.status === 200) {
    // elkuldom a kepet file-kent
    res.status(200).sendFile(path.join(process.cwd(), response.message));
  } else if (response.status === 204) {
    res.status(200).send(response.message);
  } else {
    res.status(response.status).send(response.message);
  }
});

router.get('/profilePicture/:userName', authHandler.isLoggedIn, async (req, res) => {
  const { userName } = req.params;
  const response = await service.getProfilePictureForSpecificUser(userName);
  if (response.status === 200) {
    res.status(200).sendFile(path.join(process.cwd(), response.message));
  } else if (response.status === 204) {
    res.status(200).send(response.message);
  } else {
    res.status(response.status).send(response.message);
  }
});

router.patch('/users/password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const response = await service.updatePassword(req, res, oldPassword, newPassword);
  res.status(response.status).json(response.message);
});

router.patch('/users/userData', async (req, res) => {
  const {
    firstName, lastName, email, workplace, description, phoneNumber,
  } = req.body;
  console.log(req.body);
  const response = await service.updateUserData(req, res, {
    firstName, lastName, email, description, workplace, phoneNumber,
  });
  res.status(response.status).json(response.message);
});

router.patch('/users/locality', async (req, res) => {
  const { countryName, regionName, cityName } = req.body;
  const newResidence = { countryName, regionName, cityName };
  const response = await service.updateLocality(req, res, newResidence);
  res.status(response.status).send(response.message);
});

router.get('/users/chat/:userName', authHandler.isLoggedIn, async (req, res) => {
  const { userName } = req.params;
  const response = await service.getFirstNameAndLastName(userName);
  if (response.status === 200) {
    res.status(200).json(response.message);
  } else {
    res.status(res.status).json(response.message);
  }
});

module.exports = router;
