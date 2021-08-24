const db = require('./config');

exports.findCountryIdByName = (countryName) => db.query(
  'FOR c in Country FILTER c.countryName == @countryName RETURN c._id',
  { countryName },
);

exports.upsertCountry = (countryName) => db.query('UPSERT { countryName: @countryName } INSERT { countryName: @countryName } UPDATE {} IN Country', { countryName });

exports.getCountryNameByLocalityId = async (localityId) => db.query(
  'FOR b in BeLocated FILTER b._from == @localityId\n'
  + 'FOR c in Country FILTER c._id == b._to RETURN { countryName: c.countryName }',
  { localityId },
);
