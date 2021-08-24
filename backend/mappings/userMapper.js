exports.mapModelToCountryDto = (model) => ({ countryName: model.country });

exports.mapModelToLocalityDto = (model) => ({ localityName: model.region, cityName: model.city });

exports.mapModelToUserDto = (model) => ({
  userName: model.userName,
  firstName: model.firstName,
  lastName: model.lastName,
  password: model.password,
  role: model.role,
  email: model.email,
  gender: model.gender,
});

exports.mapUserModelToOutgoingDto = async (model) => ({
  userName: model.userName,
  firstName: model.firstName,
  lastName: model.lastName,
  email: model.email,
  regionName: model.regionName,
  cityName: model.cityName,
  countryName: model.countryName,
  description: model.description ? model.description : null,
  workplace: model.workplace ? model.workplace : null,
  phoneNumber: model.phoneNumber ? model.phoneNumber : null,
});

exports.mapModelForAdminToOutgoingDto = (model) => ({
  userName: model.userName,
  firstName: model.firstName,
  lastName: model.lastName,
});

exports.mapUserToHomePageOutgoingDto = (model) => ({
  firstName: model.firstName,
  lastName: model.lastName,
});
