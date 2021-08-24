exports.mapUncontactedUserModelToDto = (model) => ({
  latitude: model.latitude,
  longitude: model.longitude,
  distance: model.distance,
  firstName: model.firstName,
  lastName: model.lastName,
  email: model.email,
  gender: model.gender,
  userName: model.userName,
  cityName: model.cityName,
  phoneNumber: model.phoneNumber,
});
