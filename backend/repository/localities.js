const db = require('./config');

exports.findLocalityIdByName = (locality) => db.query(
  'FOR l in Locality FILTER l.regionName == @localityName && l.cityName == @cityName RETURN l._id',
  {
    localityName: locality.localityName,
    cityName: locality.cityName,
  },
);

exports.upsertLocality = (locality) => db.query(
  'UPSERT { regionName: @localityName, cityName: @cityName } INSERT { regionName: @localityName, cityName: @cityName, latitude: @latitude, longitude: @longitude } UPDATE {} IN Locality',
  {
    localityName: locality.localityName,
    cityName: locality.cityName,
    latitude: locality.latitude,
    longitude: locality.longitude,
  },
);

exports.upsertBeLocated = (localityId, countryId) => db.query(
  'UPSERT { _from: @localityId, _to: @countryId} INSERT { _from: @localityId, _to: @countryId } UPDATE {} IN BeLocated',
  { localityId, countryId },
);

exports.getLocalityByUserId = async (userId) => db.query(
  'FOR l in LocatedIn FILTER l._from == @userId\n'
  + 'FOR loc in Locality FILTER loc._id == l._to\n'
  + 'RETURN { regionName: loc.regionName, cityName: loc.cityName, localityId: loc._id }',
  { userId },
);

exports.updateLocatedIn = async (userId, localityId, newLocalityId) => db.query(
  'FOR loc in LocatedIn FILTER loc._from == @userId && loc._to == @localityId UPDATE loc WITH { _to: @newLocalityId } in LocatedIn',
  { userId, localityId, newLocalityId },
);

exports.findLocalityIdByUserId = async (userId) => db.query(
  'FOR l in LocatedIn FILTER l._from == @userId RETURN l._to',
  { userId },
);
