import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';
import Translate from '../../../i18n/translate';
import { VARIANT_TYPES } from '../../../types/variantTypes';

const feedback = (props) => (
  <Alert
    variant={props.variant}
    show={props.show}
    style={{ textAlign: 'center', width: '100%' }}
  >
    {props.variant === VARIANT_TYPES.succes && (<BsCheckCircle />)}
    {props.variant === VARIANT_TYPES.danger && (<BsXCircle />)}
    {' '}
    {Translate(props.messageId)}
  </Alert>
);

export default feedback;
