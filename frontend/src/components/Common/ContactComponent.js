import React, { useEffect, useState } from 'react';
import { Row, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FaUserAltSlash } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { GrUser } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import { CONTACT_STATUS } from '../../types/contactStatus';

const messages = {
  contactHerId: 'personsNearbySurface_contactHer',
  contactHimId: 'personsNearbySurface_contactHim',
  cancelRequestId: 'contactRequest_cancelRequest',
  sentYouId: 'contactRequest_sentYouARequest',
  requestSentId: 'contactRequest_requestSent',
  removeId: 'newTrainingPlan_remove',
  confirmId: 'commonMessages_confirm',
};

const reusableButtons = (props) => {
  const [mouseHovered, setMouseHovered] = useState(false);
  const [contactWithUser, setContactWithUser] = useState('');
  const [requestSentBy, setRequestSentBy] = useState('');

  useEffect(() => {
    // megnézzük, hogy milyen kapcsolatban áll a jelenlegi felhasználó az elérni kívánt felh-val
    if (props.personData.userName) {
      axios.get(`/api/personsNearby/contactStatus/${props.personData.userName}`)
        .then((resp) => {
        // ha már volt kérés elküldve, egy objektumot kapunk vissza, különben egy szöveget
          setContactWithUser(resp.data.contact ? resp.data.contact : resp.data);
          if (resp.data.requestSentBy) {
            setRequestSentBy(resp.data.requestSentBy);
          }
        })
        .catch(() => setContactWithUser(CONTACT_STATUS.noContact));
    }
  }, [props.personData.userName]);
  const sendRequest = (event, userName) => {
    event.preventDefault();
    axios.post(`/api/personsNearby/${userName}`)
      .then(() => {
        setContactWithUser(CONTACT_STATUS.pending);
        setRequestSentBy(props.userName);
      })
      .catch(() => {});
  };

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

  const profileButton = (
    <Link to={`/profile/${props.personData.userName}`}>
      <Button variant="outline-secondary" style={{ marginLeft: '10px', borderRadius: '8px' }}><GrUser /></Button>
    </Link>
  );

  const contactHerButton = (
    <Row>
      <Button className="Button" onClick={(e) => sendRequest(e, props.personData.userName)}>
        {props.personData.gender === 'male' ? <FormattedMessage id={messages.contactHimId} />
          : <FormattedMessage id={messages.contactHerId} />}
      </Button>
      {props.enableProfile && profileButton}
    </Row>
  );

  const requestSentButton = (
    <Row>
      <Button
        variant={mouseHovered ? 'danger' : 'outline-success'}
        style={{ borderRadius: '8px' }}
        onClick={(e) => deleteRequest(e, props.personData.userName)}
        onMouseOver={() => setMouseHovered(true)}
        onMouseLeave={() => setMouseHovered(false)}
      >
        {mouseHovered ? <FormattedMessage id={messages.cancelRequestId} />
          : <FormattedMessage id={messages.requestSentId} />}
      </Button>
      {props.enableProfile && profileButton}
    </Row>
  );
  const requestHandlerButtons = (
    <div style={{ marginLeft: '16px' }}>
      <Row>
        <FormattedMessage id={messages.sentYouId} />
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Button
          variant="outline-success"
          style={{ borderRadius: '8px', marginLeft: '12px' }}
          onClick={(e) => acceptRequest(e, props.personData.userName)}
        >
          <FormattedMessage id={messages.confirmId} />
        </Button>
        <Button
          variant="outline-danger"
          style={{ borderRadius: '8px', marginLeft: '10px' }}
          onClick={(e) => deleteRequest(e, props.personData.userName)}
        >
          <FormattedMessage id={messages.removeId} />
        </Button>
      </Row>
    </div>
  );
  return (
    <Aux>
      { contactWithUser === CONTACT_STATUS.noContact
        && props.personData.userName !== props.userName && contactHerButton }
      { (contactWithUser === CONTACT_STATUS.pending && requestSentBy === props.userName)
        ? requestSentButton : null }
      { (contactWithUser === CONTACT_STATUS.pending && requestSentBy !== props.userName)
        ? requestHandlerButtons : null }
      { contactWithUser === CONTACT_STATUS.contacted && (
        <Button variant="outline-danger" style={{ borderRadius: '8px' }} onClick={(e) => deleteRequest(e, props.personData.userName)}>
          <IconContext.Provider
            value={{
              className: 'global-class-name',
              size: '25px',
            }}
          >
            <FaUserAltSlash />
          </IconContext.Provider>
        </Button>
      ) }
    </Aux>
  );
};

export default reusableButtons;
