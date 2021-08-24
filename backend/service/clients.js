const dbClients = require('../repository/clients'),
  utils = require('./utils'),
  dbUsers = require('../repository/users');

const getContactedClients = async (req, res) => {
  try {
    const { user } = await utils.getUser(req, res);
    const clientsDoc = await dbClients.getContactedClients(user._id);
    const allContactedClients = await clientsDoc.all();
    return { status: 200, message: allContactedClients };
  } catch (err) {
    return { status: 401, message: 'Unauthorized' };
  }
};

exports.getContactedClients = getContactedClients;

exports.getClientsToAttach = async (req, res, trainingPlanId) => {
  const { status, message } = await getContactedClients(req, res);
  if (status === 200) {
    try {
      const clientsDocument = await dbClients.getClientsAndCheckBelonging(message, trainingPlanId);
      const allContactedClientsWithPlusCheck = await clientsDocument.all();
      return { status, message: allContactedClientsWithPlusCheck };
    } catch (err) {
      return { status: 500, message: 'Internal server error' };
    }
  }
  return { status, message };
};

exports.saveAttachment = async (clientName, trainingPlanId) => {
  try {
    const userDoc = await dbUsers.findUserByUserName(clientName);
    const user = await userDoc.next();
    await dbClients.saveAttachment(trainingPlanId, user._id);
    return { status: 200, message: 'Client attached' };
  } catch (err) {
    return { status: 500, message: 'Internal server error' };
  }
};

exports.deleteAttachment = async (clientName, trainingPlanId) => {
  try {
    const userDoc = await dbUsers.findUserByUserName(clientName);
    const user = await userDoc.next();
    await dbClients.deleteAttachment(trainingPlanId, user._id);
    return { status: 200, message: 'Client attached' };
  } catch (err) {
    return { status: 500, message: 'Internal server error' };
  }
};
