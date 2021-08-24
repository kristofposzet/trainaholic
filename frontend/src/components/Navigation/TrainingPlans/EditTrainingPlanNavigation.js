import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Translate from '../../../i18n/translate';
import '../../Styles/Button.css';

const messages = {
  editTrainPlanId: 'editTrainingPlanNavigation_editTrainPlan',
  attachedClientsId: 'editTrainingPlanNavigation_attachedClients',
};

const editTrainingPlanNavigation = (props) => (
  <Row>
    <Col md={{ span: 3, offset: 2 }} xs={{ span: 3, offset: 2 }}>
      <Link to={`/trainingPlans/${props.trainingPlanId}`}>
        <Button className="Button" style={{ width: '200px', textAlign: 'center' }}>
          {Translate(messages.editTrainPlanId)}
        </Button>
      </Link>
    </Col>
    <Col md={{ span: 3 }} xs={{ span: 6, offset: 2 }}>
      <Link to={`/clients/attached/${props.trainingPlanId}`}>
        <Button className="Button" style={{ width: '200px', textAlign: 'center' }}>
          {Translate(messages.attachedClientsId)}
        </Button>
      </Link>

    </Col>
  </Row>
);

export default editTrainingPlanNavigation;
