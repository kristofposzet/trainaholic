import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import TrainingPlanCard from '../../../containers/TrainingPlans/CurrentTrainingPlans/TrainingPlanCard';
import Translate from '../../../i18n/translate';
import '../../Styles/Button.css';
import './TrainingPlansModal.css';

const messages = {
  exitId: 'commonMessages_exit',
  herTrainingPlansId: 'homePage_trainingPlansOf',
};

const trainingPlansModal = (props) => {
  const [trainingPlans, setTrainingPlans] = useState([]);
  useEffect(() => {
    axios.get(`/api/trainingPlans/client/${props.clientName}`)
      .then((resp) => {
        setTrainingPlans(resp.data);
      })
      .catch(() => setTrainingPlans(null));
  }, []);

  return (
    <Modal show={props.show} onHide={props.handleClose} scrollable dialogClassName="IncWidth">
      <Modal.Header closeButton>
        <Modal.Title>
          {props.firstName}
          {' '}
          {Translate(messages.herTrainingPlansId)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {
            trainingPlans && trainingPlans.map((trainingPlan, key) => (
              <Col key={`Trainingplan${key + 1}`} lg={{ span: 4 }} md={{ span: 8 }} xs={{ span: 12 }}>
                <div style={{ marginBottom: '25px' }}>
                  <TrainingPlanCard
                    trainingPlan={trainingPlan.exercises}
                    trainingPlanId={trainingPlan.id}
                    trainingPlanDeleted={props.trainingPlanDeleted}
                    trainingPlanName={trainingPlan.trainingPlanName}
                    trainingDate={trainingPlan.trainingDate}
                    selectedImage={trainingPlan.selectedImage}
                    clientName={props.clientName}
                    showInModal
                  />
                </div>
              </Col>
            ))
            }
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" style={{ borderRadius: '8px' }} onClick={props.handleClose}>
          {Translate(messages.exitId)}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default React.memo(trainingPlansModal);
