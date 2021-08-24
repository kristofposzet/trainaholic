const dbHome = require('../repository/home'),
  utils = require('./utils'),
  USER_ROLES = require('../types/userRoles');

exports.getContactedUsers = async (req, res) => {
  try {
    const { user, role } = await utils.getUser(req, res);
    const clientsDoc = role === USER_ROLES.coach
      ? await dbHome.getContactedClients(user._id) : await dbHome.getContactedCoaches(user._id);
    const allContactedClients = await clientsDoc.all();
    return { status: 200, message: allContactedClients };
  } catch (err) {
    return { status: 401, message: 'Unauthorized' };
  }
};
