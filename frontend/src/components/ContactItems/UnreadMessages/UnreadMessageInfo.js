import React from 'react';
import {
  Dropdown, NavDropdown,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

const unreadMessageInfo = (props) => (
  <div>
    <NavDropdown.Item>
      <div
        role="button"
        onClick={() => props.history.push(`/chat?name=${props.unreadMsgInfo.undreadMsgFrom}&room=${props.unreadMsgInfo.room}`)}
        onKeyDown={() => props.history.push(`/chat?name=${props.unreadMsgInfo.undreadMsgFrom}&room=${props.unreadMsgInfo.room}`)}
        tabIndex={0}
      >
        {props.unreadMsgInfo.firstName}
        {' '}
        {props.unreadMsgInfo.lastName}
      </div>
    </NavDropdown.Item>
    <Dropdown.Divider />
  </div>
);

export default withRouter(unreadMessageInfo);
