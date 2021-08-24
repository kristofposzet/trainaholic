exports.mapClientsToOutgoingDto = (model) => ({
  userName: model.userName,
  firstName: model.firstName,
  lastName: model.lastName,
});
