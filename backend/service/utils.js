const qs = require('qs'),
  userService = require('./userService'),
  dbUsers = require('../repository/users');

exports.getUser = async (req, res) => {
  try {
    const userInformations = await userService.introspect(req, res);
    if (userInformations.message.user) {
      const userName = userInformations.message.user;
      const { role } = userInformations.message;
      const userDocument = await dbUsers.findUserByUserName(userName);
      const user = await userDocument.next();
      return { user, role };
    }
    return { message: userInformations.message };
  } catch (err) {
    return { message: 'Internal server error' };
  }
};

exports.getQueryParamNamesAndValues = (queryComponent) => {
  let paramName = null;
  let value = null;
  if (queryComponent.length === 2) {
    paramName = queryComponent[0].split('?').pop();
    if (paramName !== 'name' && paramName !== 'distance') {
      paramName = null;
    } else {
      value = paramName === 'distance' ? +queryComponent[1] : {
        // a keresztnév és a vezetéknév között space van, a space-ek +szal vannak helyettesítve
        // pl. a Kovács a query stringben Kov%C3%A1cs-ként jelenik meg, ezt érdemes parse-olni, hogy
        // helyesen működjön ékezetekre is
        nameFirst: Object.keys(qs.parse(queryComponent[1].split('+')[0]))[0],
        nameSecond: Object.keys(qs.parse(queryComponent[1].split('+')[1]))[0],
      };
    }
  }
  return { paramName, value };
};
