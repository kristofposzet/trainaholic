import React from 'react';
import EditTrainingPlanNav from '../../Navigation/TrainingPlans/EditTrainingPlanNavigation';
import TrainingPlans from '../../../containers/TrainingPlans/TrainingPlans';

const editTrainingPlan = (props) => {
  const { id } = props.match.params;
  return (
    <div style={{ marginTop: '28px', margin: '30px' }}>
      <EditTrainingPlanNav trainingPlanId={id} />
      <TrainingPlans trainingPlanId={id} />
    </div>
  );
};

export default editTrainingPlan;
