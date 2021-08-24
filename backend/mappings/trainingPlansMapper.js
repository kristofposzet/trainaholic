exports.mapTrainingPlanToDto = (item) => ({
  // eslint-disable-next-line no-underscore-dangle
  id: item._key,
  exercises: item.exercises,
  trainingDate: item.trainingDate,
  trainingPlanName: item.trainingPlanName,
  selectedImage: item.selectedImage,
});
