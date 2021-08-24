import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Translate from '../../../i18n/translate';
import '../../Styles/Button.css';

const messages = {
  newTrainingPlanId: 'trainingPlanNavigation_newTrainingPlan',
  currentTrainingPlansId: 'trainingPlanNavigation_currentTrainingPlans',
  newExerciseId: 'trainingPlanNavigation_newExercise',
};

const trainingPlanNavigation = () => (
  <Row>
    <Col md={{ span: 3, offset: 1 }} xs={{ span: 3, offset: 2 }}>
      <Link to="/newTrainingPlan">
        <Button className="Button" style={{ width: '200px', textAlign: 'center', marginBottom: '6px' }}>
          {Translate(messages.newTrainingPlanId)}
        </Button>
      </Link>

    </Col>
    <Col md={{ span: 3, offset: 1 }} xs={{ span: 6, offset: 2 }}>
      <Link to="/trainingPlans">
        <Button className="Button" style={{ width: '200px', textAlign: 'center', marginBottom: '6px' }}>
          {Translate(messages.currentTrainingPlansId)}
        </Button>
      </Link>

    </Col>
    <Col md={{ span: 3, offset: 1 }} xs={{ span: 9, offset: 2 }}>
      <Link to="/newExercise">
        <Button className="Button" style={{ width: '200px', textAlign: 'center' }}>
          {Translate(messages.newExerciseId)}
        </Button>
      </Link>
    </Col>

  </Row>
);

export default trainingPlanNavigation;
