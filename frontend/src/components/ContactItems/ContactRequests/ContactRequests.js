import React, { useState } from 'react';
import {
  Dropdown, NavDropdown, Row, Button, Col,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { HiUserAdd, HiUserRemove } from 'react-icons/hi';
import { CONTACT_STATUS } from '../../../types/contactStatus';

const contactRequests = (props) => {
  const [contactWithUser, setContactWithUser] = useState(CONTACT_STATUS.pending);

  const deleteRequest = (event, userName) => {
    event.preventDefault();
    axios.delete(`/api/personsNearby/${userName}`)
      .then(() => {
        setContactWithUser(CONTACT_STATUS.noContact);
      })
      .catch(() => {});
  };

  const acceptRequest = (event, userName) => {
    event.preventDefault();
    axios.put(`/api/personsNearby/${userName}`)
      .then(() => {
        setContactWithUser(CONTACT_STATUS.contacted);
      })
      .catch(() => {});
  };
  return (
    contactWithUser === CONTACT_STATUS.pending && (
    <div>
      <NavDropdown.Item>
        {/* Ha a NavDropdown-ra tesszuk az esemenykezelot, amely atvisz a profilra, barmilyen mas
        gombot nyomunk, akkor is a profilra erkezunk. Emiatt a div-nek adtam meg az event
        handlert => emiatt szukseg volt 3 ujabb belso elem bevezetesere, hogy ugy viselkedjen,
        mint egy button. tabindex={0}: erre az elemre lehet fokuszolni */}
        <div
          role="button"
          onClick={() => props.history.push(`/profile/${props.userName}`)}
          onKeyDown={() => props.history.push(`/profile/${props.userName}`)}
          tabIndex={0}
        >
          {props.firstName}
          {' '}
          {props.lastName}
        </div>
        <Row>
          <Col>
            <Button
              variant="outline-success"
              style={{ borderRadius: '8px', marginLeft: '12px' }}
              onClick={(e) => acceptRequest(e, props.userName)}
            >
              <HiUserAdd />
            </Button>
          </Col>
          <Col>
            <Button
              variant="outline-danger"
              style={{ borderRadius: '8px', marginLeft: '10px' }}
              onClick={(e) => deleteRequest(e, props.userName)}
            >
              <HiUserRemove />
            </Button>
          </Col>
        </Row>
      </NavDropdown.Item>
      <Dropdown.Divider />

    </div>
    )
  );
};

export default withRouter(contactRequests);
