import React from 'react';
import { Modal } from 'react-bootstrap';
import Translate from '../../../i18n/translate';
import TableExercises from '../../TrainingPlans/Table/TableExercises';

const trainingPlanModal = (props) => (
  <Modal show={props.showModal} onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{Translate('trainingPlanModal_exercises')}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <TableExercises selectedExercises={props.selectedExercises} />
    </Modal.Body>
  </Modal>
);

export default trainingPlanModal;
