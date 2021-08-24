import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import UnreadMessageInfo from './UnreadMessageInfo';
import Translate from '../../../i18n/translate';

const messages = {
  incomingMsgId: 'contactRequest_incomingMsg',
  noIncomingMsgId: 'contactRequest_noIncomingMsg',
};

const unreadMessagesMapper = (props) => (
  <NavDropdown
    style={{ marginLeft: '18px' }}
    title={(
      <div>
        {Translate(messages.incomingMsgId)}
        {' '}
        {props.unreadMsgInfos.length > 0 && (
        <HiOutlineExclamationCircle style={{ color: 'red' }} />)}
      </div>
)}
    id="basic-nav-dropdown-unread-msg"
  >
    {props.unreadMsgInfos.length > 0
      ? props.unreadMsgInfos.map((unreadMsgInfo, index) => (
        unreadMsgInfo.unreadMsgFrom !== props.currentUser && (
        <UnreadMessageInfo
          key={`${index + 1}xd`}
          unreadMsgInfo={unreadMsgInfo}
        />
        )
      )) : Translate(messages.noIncomingMsgId)}
  </NavDropdown>
);

export default unreadMessagesMapper;
