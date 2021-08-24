const db = require('./config');

const belongsToEdgeCollection = db.collection('BelongsToClient');

exports.getContactedClients = async (userId) => db.query(
  'FOR p in PaysAttention FILTER p._from == @userId && p.contact.contact == \'contacted\'\n'
+ 'FOR u in User FILTER u._id == p._to RETURN { userName: u.userName, firstName: u.firstName, lastName: u.lastName, userId: u._id }',
  { userId },
);

// végigjárjuk a users tömböt és megnézzük, hogy azok a kliensek hozzá voltak-e már csatolva egy
// megadott id-jú edzéstervhez és ezt a bool-t vissza is térítjük a többi szükséges attribútummal
// isAttached = 1 elemu tomb, 0. eleme egy bool
exports.getClientsAndCheckBelonging = async (users, trainingPlanId) => db.query(
  'FOR u in User FOR user in @users FILTER u._id == user.userId\n'
  + 'LET isAttached = (\n'
  + 'RETURN (COUNT(FOR b IN BelongsToClient FILTER user.userId == b._to && b._from == @trainingPlanId RETURN 1) == 0 ? false: true)\n'
  + ')RETURN { isAttached: isAttached[0], userName: u.userName, firstName: u.firstName, lastName: u.lastName }',
  { users, trainingPlanId },
);

exports.saveAttachment = async (trainingPlanId, clientId) => belongsToEdgeCollection.save({
  _from: trainingPlanId,
  _to: clientId,
});

exports.deleteAttachment = async (trainingPlanId, clientId) => db.query(
  'FOR b in BelongsToClient FILTER b._from == @trainingPlanId && b._to == @clientId REMOVE b in BelongsToClient',
  { trainingPlanId, clientId },
);
