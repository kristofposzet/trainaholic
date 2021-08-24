exports.mapModelsToOutgoingProfileDto = (user, country, locality) => ({
  userName: user.userName,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  comments: user.comments ? user.comments : null,
  cityName: locality.cityName,
  countryName: country.countryName,
  countyName: locality.regionName,
  description: user.description ? user.description : null,
  workplace: user.workplace ? user.workplace : null,
  role: user.role,
  phoneNumber: user.phoneNumber ? user.phoneNumber : null,
});
