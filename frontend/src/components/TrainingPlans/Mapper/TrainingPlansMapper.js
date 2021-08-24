import React from 'react';
import { Row } from 'react-bootstrap';
import TrainingPlanCard from '../../../containers/TrainingPlans/CurrentTrainingPlans/TrainingPlanCard';

const trainingPlansMapper = (props) => (
// a trainingPlan tomb edzesterveket es id-kat objektumonkent tartalmaz
  // az edzestervek objektumok, amelyek gyakorlatokat tartalmaznak, alakja pl.:
  // obj {1} -> exercises {3} -> 0 {...} 1 {...} 2 {...}
  // a 0, 1, 2-es obj-ban 1-1-1 gyakorlat szerepel nevvel, ismetlessel, sorozatszammal
  <Row lg={6} md={3} xs={2}>
    {
    props.trainingPlans.map((trainingPlan, key) => (
      <div key={`Trainingplan${key + 1}`} style={{ marginRight: '45px', marginBottom: '25px' }}>
        <TrainingPlanCard
          trainingPlan={trainingPlan.exercises}
          trainingPlanId={trainingPlan.id}
          trainingPlanDeleted={props.trainingPlanDeleted}
          trainingPlanName={trainingPlan.trainingPlanName}
          trainingDate={trainingPlan.trainingDate}
          selectedImage={trainingPlan.selectedImage}
          isCoach={props.isCoach}
        />
      </div>
    ))
}
  </Row>
);

export default trainingPlansMapper;
