import React from 'react';

import { Container, Row } from 'react-bootstrap';
import Message from './Message';
import './Chat.css';

const messageMapper = (props) => (
  <Container>
    {props.messages.map((message, index) => (
      <Row key={`${new Date().toISOString()}-${index + 1}`}>
        <Message msg={message} toUser={props.toUser} />
      </Row>
    ))}
  </Container>
);

export default messageMapper;
