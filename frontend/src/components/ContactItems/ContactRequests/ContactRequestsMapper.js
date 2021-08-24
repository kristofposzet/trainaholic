import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import Translate from '../../../i18n/translate';
import ContactRequests from './ContactRequests';

const messages = {
  contactRequestsId: 'contactRequests_contactRequests',
  noRequestId: 'contactRequest_noRequest',
};

const contactRequests = (props) => (
  <NavDropdown
    style={{ marginLeft: '18px' }}
    title={(
      <div>
        {Translate(messages.contactRequestsId)}
        {' '}
        {props.usersWithPendingContact.length > 0 && (
        <HiOutlineExclamationCircle style={{ color: 'red' }} />)}
      </div>
)}
    id="basic-nav-dropdown"
  >
    {props.usersWithPendingContact.length > 0 ? props.usersWithPendingContact.map(
      (user) => (
        <ContactRequests
          userName={user.userName}
          firstName={user.firstName}
          lastName={user.lastName}
          key={user.userName}
        />
      ),
    ) : Translate(messages.noRequestId)}
  </NavDropdown>
);

export default contactRequests;
