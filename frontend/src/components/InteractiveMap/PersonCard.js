import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { FaPhoneAlt } from 'react-icons/fa';
import { AiFillMessage } from 'react-icons/ai';
import { IMAGE_SRC } from '../../types/imagesByGender';
import ContactComponent from '../Common/ContactComponent';
import Translate from '../../i18n/translate';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import { USER_ROLES } from '../../types/userRoles';

const messages = {
  inYourLocalityId: 'personsNearbySurface_inYourLocality',
  contactHerId: 'personsNearbySurface_contactHer',
  contactHimId: 'personsNearbySurface_contactHim',
  requestSentId: 'contactRequest_requestSent',
  cancelRequestId: 'contactRequest_cancelRequest',
  removeId: 'newTrainingPlan_remove',
  confirmId: 'commonMessages_confirm',
  sentYouId: 'contactRequest_sentYouARequest',
  inId: 'commonMessages_in',
  notSpecifiedId: 'commonMessages_notSpecified',
};

const personCard = (props) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  // hasonlo a componentDidMount-hoz
  useEffect(() => {
    axios.get(`/api/profilePicture/${props.personData.userName}`, { responseType: 'blob' })
      .then((resp) => {
        if (resp.data.type === 'text/html') {
          if (resp.data.size === 4) {
            setProfilePicture(IMAGE_SRC.male);
          } else {
            setProfilePicture(IMAGE_SRC.female);
          }
        } else {
          setProfilePicture(window.URL.createObjectURL(resp.data));
        }
      })
      .catch(() => setProfilePicture(IMAGE_SRC.err));
  }, []);

  return (
    <Card style={{ width: '275px', marginTop: '10px' }}>
      <Card.Img
        variant="top"
        style={{ // az objectFit megengedi, hogy zoomra valtozzon a kep merete
          width: '100%', height: '26vh', objectFit: 'cover',
        }}
        src={profilePicture}
      />
      <Card.Body>
        <Card.Title>
          {props.personData.firstName}
          {' '}
          {props.personData.lastName}
          {' '}
          <Link to={`/chat?name=${props.personData.userName}&room=${props.role === USER_ROLES.coach ? `${props.currentUserName}_${props.personData.userName}`
            : `${props.personData.userName}_${props.currentUserName}`}`}
          >
            <Button variant="outline-secondary" style={{ borderRadius: '8px', marginLeft: '5px' }}>
              <AiFillMessage />
            </Button>
          </Link>
        </Card.Title>
        <Card.Text>
          {props.personData.distance === 0 ? <FormattedMessage id={messages.inYourLocalityId} />
            : (
              <Aux>
                {Translate(messages.inId)}
                {props.personData.cityName}
                ,
                {' '}
              </Aux>
            )}
          {props.personData.distance !== 0 && (
          <Aux>
            {parseInt(props.personData.distance / 1000, 10)}
            {' km'}
          </Aux>
          ) }
          <br />
          <Button variant="outline-secondary" onClick={() => setShowPhoneNumber(!showPhoneNumber)}>
            <FaPhoneAlt />
            {' '}
            {props.personData.phoneNumber && (
              !showPhoneNumber ? `${props.personData.phoneNumber.slice(0, -(props.personData.phoneNumber.length - 3))}*******`
                : props.personData.phoneNumber
            )}
            {!props.personData.phoneNumber && Translate(messages.notSpecifiedId)}
          </Button>
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <ContactComponent personData={props.personData} userName={props.userName} enableProfile />
      </Card.Footer>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  currentUserName: state.auth.userName,
  role: state.auth.role,
});

export default connect(mapStateToProps)(personCard);
