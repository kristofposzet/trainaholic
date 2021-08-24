const dbUsers = require('../repository/users'),
  dbPersNearby = require('../repository/personsNearby'),
  USER_ROLE = require('../types/userRoles'),
  utils = require('./utils'),
  CONTACT_STATUS = require('../types/contactStatus');

const defaultDistance = 25000;

exports.getOutgoingPersonsNearbyDto = async (req, res, queryComponent) => {
  try {
    const { user } = await utils.getUser(req, res);
    let distance = defaultDistance;
    let nameFirst = null;
    let nameSecond = null;
    if (queryComponent.paramName && queryComponent.value) {
      // ha a query stringben megadtuk a tavolsagra valo szurest
      if (queryComponent.paramName === 'distance' && typeof queryComponent.value === 'number') {
        // m -> km
        distance = queryComponent.value * 1000;
      } else if (queryComponent.paramName === 'name' && queryComponent.value) {
        nameFirst = queryComponent.value.nameFirst;
        nameSecond = queryComponent.value.nameSecond;
      }
    }
    const docCoordAndRole = await dbPersNearby.findCoordinatesAndRoleByUserName(user.userName);
    const coordAndRole = await docCoordAndRole.next();
    const doc =  (nameFirst && nameSecond)
      ? await dbPersNearby.findInfosByName(
        coordAndRole.latitude, coordAndRole.longitude, nameFirst, nameSecond,
      )
      : await
      dbPersNearby.findInfosByShortestDistance(
        coordAndRole.latitude, coordAndRole.longitude, distance,
      );
    const informations = await doc.all();
    // ha klienssel vagyok bejelentkezve, akkor edzoket keresek, kulonben forditva
    const outgoingDocument = await dbPersNearby.findOutgoingDataByUserIds(informations,
      coordAndRole.role === USER_ROLE.client ? USER_ROLE.coach : USER_ROLE.client, user._id);
    const outgoingPersonsNearby = await outgoingDocument.all();
    // miutan megkaptam az osszes megfelelo klienst/ edzot, megnezem, hogy ne legyen olyan, akivel
    // felvettem a kapcsolatot
    const outgoingDocumentWithUncontactedUsers = await dbPersNearby.getAllUncontactedUsers(
      outgoingPersonsNearby, user.role, user._id,
    );
    const outgoing = await outgoingDocumentWithUncontactedUsers.all();
    return { status: 200, message: outgoing };
  } catch (err) {
    return { status: 404, message: 'Bad request' };
  }
};

const saveContact = async (userName, req, res, contact) => {
  try {
    const { user, role } = await utils.getUser(req, res);
    const userDocument = await dbUsers.findUserByUserName(userName);
    // o a kivant felhasznalo, akivel fel szeretnenk venni a kapcsolatot:
    const desiredUser = await userDocument.next();
    // a _from mindig az edzo lesz
    const from = (role === USER_ROLE.coach) ? user._id : desiredUser._id;
    const to = (role === USER_ROLE.coach) ? desiredUser._id : user._id;
    const contactBetweenUsers = {
      requestSentBy: user.userName,
      contact,
    };
    await dbPersNearby.saveContactBetweenUsers(from, to, contactBetweenUsers);
    return { status: 200, message: 'OK' };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

exports.postContactRequest = async (userName, req, res) => {
  const response = await saveContact(userName, req, res, CONTACT_STATUS.pending);
  return response;
};

exports.putContactRequest = async (userName, req, res) => {
  const response = await saveContact(userName, req, res, CONTACT_STATUS.contacted);
  return response;
};

const getContact = async (req, res, desiredUserName) => {
  const { user, role } = await utils.getUser(req, res);
  const userDocument = await dbUsers.findUserByUserName(desiredUserName);
  const desiredUser = await userDocument.next();
  const from = (role === USER_ROLE.coach) ? user._id : desiredUser._id;
  const to = (role === USER_ROLE.coach) ? desiredUser._id : user._id;
  const contactDoc = await dbPersNearby.contactBetweenUsers(from, to);
  const contactBetweenUsers = await contactDoc.next();
  return contactBetweenUsers;
};

exports.deleteContactRequest = async (desiredUserName, req, res) => {
  try {
    const contactBetweenUsers = await getContact(req, res, desiredUserName);
    try {
      await dbPersNearby.deleteContactBetweenUsers(contactBetweenUsers._id);
      return { status: 204 };
    } catch (typeError) {
      // ha ebbe a catch-be kerul, azt jelenti, hogy idokozben a masik szemely mar elutasitotta
      // a kerest es nincs benne az ID a dokumentumban, mert kitorlodott
      return { status: 204 };
    }
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

// a bejelentkezett felhasználó kapcsolatának lekérése a kívánt felhasználóval
// kliensek/ edzök keresésénél a közelben
exports.getContactWithDesiredUser = async (req, res, desiredUserName) => {
  try {
    const contactBetweenUsers = await getContact(req, res, desiredUserName);
    const contact = contactBetweenUsers ? contactBetweenUsers.contact : CONTACT_STATUS.noContact;
    return { status: 200, message: contact };
  } catch (err) {
    return { status: 404, message: 'Not Found' };
  }
};

// megkeressuk az osszes klienst, aki egy adott edzovel szeretne kapcsolatot teremteni
// vagy az osszes edzot, aki klienssel, role-tol fuggoen
exports.getAllUsersWithPendingContact = async (req, res) => {
  try {
    const { user, role } = await utils.getUser(req, res);
    // az edzo klienseket keres, akik kuldtek neki kerest, a kliensek pedig edzoket keresnek
    const document = await dbPersNearby.getAllUsersWithPendingContact(
      user._id, role === USER_ROLE.coach ? USER_ROLE.client : USER_ROLE.coach, user.userName,
    );
    const allUsersWithPendingContact = await document.all();
    return { status: 200, message: allUsersWithPendingContact };
  } catch (err) {
    return { status: 404, message: 'Not Found' };
  }
};
