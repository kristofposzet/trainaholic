exports.mapExerciseModelToOutgoingDto = (model) => ({ id: model._id, name: model.name });

exports.mapModelToExerciseDto = (model) => ({ name: model.name });
