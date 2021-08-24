import React from 'react';
import { Table } from 'react-bootstrap';

import Translate from '../../../i18n/translate';
import TableColumns from './TableColumns';

const messages = {
  exerciseId: 'newTrainingPlan_exercise',
  setsId: 'newTrainingPlan_sets',
  repsId: 'newTrainingPlan_reps',
  weightId: 'newTrainingPlan_weight',
};

const tableExercises = (props) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>#</th>
        <th>{Translate(messages.exerciseId)}</th>
        <th>{Translate(messages.setsId)}</th>
        <th>{Translate(messages.repsId)}</th>
        <th>{Translate(messages.weightId)}</th>
        {props.canBeModified && (
        <th>
          {Translate('newTrainingPlan_remove')}
        </th>
        )}
        {props.canBeModified && (
        <th>
          {Translate('newTrainingPlan_edit')}
        </th>
        )}
      </tr>
    </thead>
    <tbody key="tbody_new_training_plan">
      {props.selectedExercises.map((exercise, index) => (
        <TableColumns
          key={index.toString() + exercise.id}
          serialNumber={index + 1}
          exerciseName={exercise.exerciseName}
          sets={exercise.sets}
          reps={exercise.reps}
          weight={exercise.weight}
          handleRemove={props.handleRemove}
          handleEdit={props.handleEdit}
          length={props.selectedExercises.length}
          canBeModified={props.canBeModified}
        />
      ))}
    </tbody>
  </Table>
);

export default tableExercises;
