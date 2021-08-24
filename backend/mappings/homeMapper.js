exports.mapUserModelToOutgoingDto = (model) => ({
  userName: model.userName,
  firstName: model.firstName,
  lastName: model.lastName,
  email: model.email,
  phoneNumber: model.phoneNumber ? model.phoneNumber : null,
});
