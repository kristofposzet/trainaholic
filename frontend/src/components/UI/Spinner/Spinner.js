import React from 'react';
import ReactSpinner from 'react-bootstrap-spinner';

const spinner = () => (
  <div style={{ textAlign: 'center', width: '100px', margin: '0 auto' }}>
    <ReactSpinner type="border" color="primary" size="6" />
  </div>
);

export default spinner;
