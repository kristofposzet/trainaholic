import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import Translate from '../../../i18n/translate';
import '../../Styles/Button.css';

const messages = {
  deleteTitleId: 'trainingPlanCard_deleteTitle',
  deleteId: 'trainingPlanCard_delete',
  cancelId: 'commonMessages_cancelId',
  okId: 'commonMessages_okId',

};

const warningModal = (props) => (
  <Modal show={props.show} onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{Translate(messages.deleteTitleId)}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {Translate(messages.deleteId)}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" style={{ borderRadius: '8px' }} onClick={props.handleClose}>
        {Translate(messages.cancelId)}
      </Button>
      <Button className="Button" onClick={props.handleDeleteTrainingPlan}>
        {Translate(messages.okId)}
      </Button>
    </Modal.Footer>
  </Modal>
);
export default warningModal;
