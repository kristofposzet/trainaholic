import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Translate from '../../../i18n/translate';

const guestModal = (props) => (
  <Modal show={props.show && !props.isAuthenticated} onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{Translate(props.title)}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {props.children}
    </Modal.Body>
  </Modal>
);
export default guestModal;
