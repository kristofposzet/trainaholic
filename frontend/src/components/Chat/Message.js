import React from 'react';

const message = (props) => (
  <div className={`bubble ${props.toUser !== props.msg.fromUser ? 'me' : 'you'}`}>{props.msg.text}</div>
);

export default message;
