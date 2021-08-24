import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Feedback from './UIFeedback';

const feedbackWrapper = (props) => (
  <Container>
    <Row className="justify-content-md-center mt-5">
      <Col lg="6">
        <Feedback
          show={props.showFeedback}
          variant={props.variant}
          messageId={props.messageId}
        />
      </Col>
    </Row>
  </Container>
);

export default feedbackWrapper;
