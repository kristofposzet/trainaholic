const jwt = require('jsonwebtoken'),
  fs = require('fs'),
  path = require('path'),
  axios = require('axios'),
  bcrypt = require('bcrypt'),
  config = require('../config.json'),
  dbUsers = require('../repository/users'),
  dbCountries = require('../repository/countries'),
  mapper = require('../mappings/userMapper'),
  dbLocalities = require('../repository/localities'),
  utils = require('./utils');

const createToken = (user) => jwt.sign(user, config.keys.jwtAccesKey, { expiresIn: '15m' });
const createRefreshToken = (user) => jwt.sign(user, config.keys.jwtRefreshKey, { expiresIn: '48h' });
const saltRounds = 10;

const register = async (countryDto, localityDto, userName) => {
  try {
    const userCursor = await dbUsers.numberOfUsersByUserName(userName);
    const noOfUsers = await userCursor.next();
    if (noOfUsers > 0) {
      return { status: 400, message: 'Wrong credentials' };
    }
    const positionData = await axios.default.get(
      'http://api.positionstack.com/v1/forward', {
        params: {
          access_key: config.keys.apiAccesKey,
          query: `${localityDto.cityName} ${localityDto.localityName} ${countryDto.countryName}`,
        },
      },
    );
    const geoInformations = await positionData.data;
    const locality = localityDto;
    locality.latitude = geoInformations.data[0].latitude;
    locality.longitude = geoInformations.data[0].longitude;
    await dbCountries.upsertCountry(countryDto.countryName);
    await dbLocalities.upsertLocality(locality);
    const cursor = await dbLocalities.findLocalityIdByName(locality);
    const localityId = await cursor.next();
    // 1 talalat szukseges => next()
    const countryCursor = await dbCountries.findCountryIdByName(countryDto.countryName);
    const countryId = await countryCursor.next();
    await dbLocalities.upsertBeLocated(localityId, countryId);
    return { status: 200, message: 'OK', localityId };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const submitUser = async (user) => {
  // assignment to parameter not allowed => new variable
  const userData = { ...user };
  userData.refreshToken = '';
  const localityDto = mapper.mapModelToLocalityDto(userData);
  const countryDto = mapper.mapModelToCountryDto(userData);
  const userDto = mapper.mapModelToUserDto(userData);
  try {
    const response = await register(countryDto, localityDto, userDto.userName);
    if (response.status === 200) {
      // https://www.npmjs.com/package/bcrypt
      // 2-felekeppen lehet salt-ot es hasht generalni: az elsoben szukseg van a genSalt fg.-re
      // a 2. technikanak is ugyanaz a kimenete, mint az elsonek, csak itt a salt es a hash is
      // automatikusan van generalva
      const hashValue = await bcrypt.hash(userDto.password, saltRounds);
      userDto.password = hashValue;
      const document = await dbUsers.insertUser(response.localityId, userDto);
      return { status: 201, message: document };
    }
    // ha nem sikerulnek a register fg-ben a muveletek, akkor visszateritjuk azt a valaszt,
    // amit onnan kaptunk
    return { status: response.status, message: response.message };
  } catch (errMsg) {
    return { status: 500, message: 'Error registering user' };
  }
};

exports.submitUser = submitUser;

exports.introspect = async (req, res) => {
  if (req.cookies === undefined || req.cookies === null) {
    return { status: 404, message: 'Undefined cookie' };
  } // else
  const { accesToken } = req.cookies;
  const { refreshToken } = req.cookies;
  if (accesToken === null || refreshToken === null) {
    return { status: 401, message: 'Unauthorized' };
  }
  // else
  try {
    const verifiedToken = jwt.verify(accesToken, config.keys.jwtAccesKey);
    return { status: 200, message: { user: verifiedToken.user, role: verifiedToken.role } };
  } catch (error) {
    try {
      const verifiedRefreshToken = jwt.verify(refreshToken, config.keys.jwtRefreshKey);
      const user = { user: verifiedRefreshToken.user, role: verifiedRefreshToken.role };
      const cursor = await dbUsers.findRefreshTokenByUserName(verifiedRefreshToken.user);
      const storedRefreshToken = await cursor.next();
      if (storedRefreshToken === refreshToken) {
        const signedToken = jwt.sign(user, config.keys.jwtAccesKey, { expiresIn: '15m' });
        res.cookie('accesToken', signedToken, { httpOnly: true, sameSite: 'strict' });
        return {
          status: 200,
          message: { user: verifiedRefreshToken.user, role: verifiedRefreshToken.role },
        };
      }
      return { status: 401, message: 'Jwt must be provided' };
    } catch (err) {
      return { status: 401, message: 'Jwt must be provided' };
    }
  }
};

const authUser = async (userName, role) => {
  const user = { user: userName, role };
  const accesToken = createToken(user);
  const refreshToken = createRefreshToken(user);
  try {
    await dbUsers.insertRefreshToken(refreshToken, userName);
    return {
      status: 200,
      message: user,
      accesToken,
      refreshToken,
    };
  } catch (err) {
    return { status: 500, message: `Error: ${err}` };
  }
};

exports.login = async (userName, password, role) => {
  try {
    // a megfelelo szerepkoru felhasznalonak keresi a jelszavat
    const userCursor = await dbUsers.findPasswordByUserName(userName, role);
    const storedPassword = await userCursor.next();
    // ha nincs jelszava, azt jelenti, hogy nem letezik a felhasznalo
    if (storedPassword === null || storedPassword === undefined) {
    // helytelen username
      return { status: 400, message: 'Wrong credentials' };
    }
    const result = await bcrypt.compare(password, storedPassword);
    if (result) {
      return authUser(userName, role);
    }
    // helytelen password
    return { status: 400, message: 'Wrong credentials' };
  } catch (err) {
    return { status: 500, message: `Error: ${err}` };
  }
};

exports.logout = async (userName, res) => {
  try {
    const cursor = await dbUsers.insertRefreshToken('', userName);
    const userExist = await cursor.next();
    if (userExist) {
      res.clearCookie('refreshToken');
      res.clearCookie('accesToken');
      return { status: 200, message: 'Logout ok' };
    }
    // elofordulhat, hogy nem letezik mar a felhasznalo, mert az admin kitorolte
    res.clearCookie('refreshToken');
    res.clearCookie('accesToken');
    return { status: 404, message: 'User not found' };
  } catch (err) {
    return { status: 500, message: 'Error clearing the cookie' };
  }
};

exports.saveProfilePicture = async (req, res, pathImg) => {
  try {
    const { user } = await utils.getUser(req, res);
    const upsertedDoc = await dbUsers.upsertPath(user._id, pathImg);
    const imagePath = await upsertedDoc.next();
    if (user.imagePath) {
      // a korábban eltárolt képét kitörlöm
      fs.unlinkSync(path.join(process.cwd(), user.imagePath));
    }
    return { status: 200, message: path.join(process.cwd(), imagePath) };
  } catch (err) {
    return { status: 500, message: 'Error - save profile picture failed' };
  }
};

exports.getProfilePicture = async (req, res) => {
  try {
    const { user } = await utils.getUser(req, res);
    return user.imagePath ?  { status: 200, message: user.imagePath }
      : { status: 204, message: user.gender };
  } catch (err) {
    return { status: 401, message: 'Unauthorized' };
  }
};

exports.getProfilePictureForSpecificUser = async (userName) => {
  try {
    const userDoc = await dbUsers.findUserByUserName(userName);
    const user = await userDoc.next();
    return user.imagePath ?  { status: 200, message: user.imagePath }
      : { status: 204, message: user.gender };
  } catch (err) {
    return { status: 401, message: 'Unauthorized' };
  }
};

exports.getPersonalInformations = async (req, res) => {
  try {
    const { user } = await utils.getUser(req, res);
    const localityDoc = await dbLocalities.getLocalityByUserId(user._id);
    const locality = await localityDoc.next();
    const countryDoc = await dbCountries.getCountryNameByLocalityId(locality.localityId);
    const country = await countryDoc.next();
    const outgoingUserDto = await mapper.mapUserModelToOutgoingDto({
      ...user,
      countryName: country.countryName,
      regionName: locality.regionName,
      cityName: locality.cityName,
    });
    return { status: 200, message: outgoingUserDto };
  } catch (err) {
    return { status: 401, message: 'Unauthorized' };
  }
};

exports.updateUserData = async (req, res, userData) => {
  try {
    const { user } = await utils.getUser(req, res);
    await dbUsers.updateUserData(user._id, userData);
    return { status: 200, message: 'New user data saved' };
  } catch (err) {
    return { status: 401, message: 'Unauthorized' };
  }
};

exports.updatePassword = async (req, res, oldPassword, newPassword) => {
  try {
    const { user } = await utils.getUser(req, res);
    const passwordsAreEquals = await bcrypt.compare(oldPassword, user.password);
    if (passwordsAreEquals) {
      const hashValue = await bcrypt.hash(newPassword, saltRounds);
      await dbUsers.updateUserData(user._id, { password: hashValue });
      return { status: 200, message: 'Password updated' };
    }
    return { status: 400, message: 'Wrong password' };
  } catch (err) {
    return { status: 401, message: 'Unauthorized' };
  }
};

exports.updateLocality = async (req, res, residence) => {
  try {
    const { user } = await utils.getUser(req, res);
    const positionData = await axios.default.get(
      'http://api.positionstack.com/v1/forward', {
        params: {
          access_key: config.keys.apiAccesKey,
          query: `${residence.cityName} ${residence.regionName} ${residence.countryName}`,
        },
      },
    );
    const geoInformations = await positionData.data;
    const { latitude } = geoInformations.data[0];
    const { longitude } = geoInformations.data[0];
    const oldLocalityDoc = await dbLocalities.findLocalityIdByUserId(user._id);
    const oldLocalityId = await oldLocalityDoc.next();
    await dbCountries.upsertCountry(residence.countryName);
    const locality = {
      localityName: residence.regionName, cityName: residence.cityName, latitude, longitude,
    };
    await dbLocalities.upsertLocality(locality);
    const cursor = await dbLocalities.findLocalityIdByName(locality);
    const localityId = await cursor.next();
    const countryCursor = await dbCountries.findCountryIdByName(residence.countryName);
    const countryId = await countryCursor.next();
    await dbLocalities.upsertBeLocated(localityId, countryId);
    if (oldLocalityId !== localityId) {
      dbLocalities.updateLocatedIn(user._id, oldLocalityId, localityId);
    }
    return { status: 200, message: 'Residence info updated successfully' };
  } catch (err) {
    return { status: 500, message: 'Internal server error' };
  }
};

exports.getAllUsers = async (pageNo) => {
  try {
    let offset = 0;
    const count = 10;
    if (pageNo && pageNo !== 1) {
      offset = count * pageNo - count;
    }
    const allUserDoc = await dbUsers.findAllUsers(offset, count);
    const allUsers = await allUserDoc.all();
    return { status: 200, message: { allUsers } };
  } catch (err) {
    return { status: 500, message: 'Internal server error' };
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const { user } = await utils.getUser(req, res);
    return { status: 200, message: user };
  } catch (err) {
    return { status: 401, message: 'Unauthorized' };
  }
};

exports.getNoOfUsers = async () => {
  try {
    const lengthDoc = await dbUsers.getNoOfAllUsers();
    const noOfAllUsers = await lengthDoc.next();
    return { status: 200, message: { noOfAllUsers } };
  } catch (err) {
    return { status: 500, message: 'Internal server error' };
  }
};

exports.deleteUser = async (userName) => {
  try {
    const userDoc = await dbUsers.findUserByUserName(userName);
    const user = await userDoc.next();
    await dbUsers.deleteUser(user._id, user.role);
    return { status: 204, message: '' };
  } catch (err) {
    return { status: 500, message: 'Internal server error' };
  }
};

exports.getFirstNameAndLastName = async (userName) => {
  try {
    const userDoc = await dbUsers.findUserByUserName(userName);
    const user = await userDoc.next();
    return { status: 200, message: { firstName: user.firstName, lastName: user.lastName } };
  } catch (err) {
    return { status: 500, message: 'Internal server error' };
  }
};

const initAdmin = async () => {
  try {
    const adminCollection = await dbUsers.findUserByUserName('admin');
    const admin = await adminCollection.next();
    if (!admin) {
      submitUser({
        userName: 'admin',
        firstName: 'Kristóf',
        lastName: 'Poszet',
        password: 'passwd',
        country: 'Romania',
        region: 'Satu Mare',
        city: 'Carei',
        gender: 'male',
        email: 'kristofposzet1@gmail.com',
        role: 3,
      });
    }
  } catch (err) {
    console.log('Admin init - error', err);
  }
};

initAdmin();
