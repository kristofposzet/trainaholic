const db = require('./config');

exports.getContactedClients = async (userId) => db.query(
  'FOR p in PaysAttention FILTER p._from == @userId && p.contact.contact == \'contacted\'\n'
+ 'FOR u in User FILTER u._id == p._to RETURN u',
  { userId },
);

exports.getContactedCoaches = async (userId) => db.query(
  'FOR p in PaysAttention FILTER p._to == @userId && p.contact.contact == \'contacted\'\n'
+ 'FOR u in User FILTER u._id == p._from RETURN u',
  { userId },
);
