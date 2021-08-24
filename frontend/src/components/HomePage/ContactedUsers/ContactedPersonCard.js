import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card, Row, Col, Button,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEye } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { GrUser } from 'react-icons/gr';
import { IconContext } from 'react-icons';
import { connect } from 'react-redux';
import { AiFillMessage } from 'react-icons/ai';
import { IMAGE_SRC } from '../../../types/imagesByGender';
import ContactComponent from '../../Common/ContactComponent';
import TrainingPlansModal from '../../UI/Modal/TrainingPlansModal';
import Translate from '../../../i18n/translate';
import { USER_ROLES } from '../../../types/userRoles';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

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
  herTrainingPlans: 'homePage_herTrainingPlans',
};

const personCard = (props) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <Aux>
      <Card style={{ width: '300px', marginTop: '10px' }}>
        <Card.Img
          variant="top"
          style={{
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
          <Card.Body>
            <Row>
              <Col lg={1}>
                <FaPhoneAlt />
              </Col>
              <Col lg={10}>
                {props.personData.phoneNumber ?? Translate(messages.notSpecifiedId)}
              </Col>
            </Row>
            <Row>
              <Col lg={1}>
                <MdEmail />
              </Col>
              <Col lg={10}>
                {props.personData.email}
              </Col>
            </Row>
          </Card.Body>
        </Card.Body>
        <Card.Footer>
          <ContactComponent personData={props.personData} userName={props.userName} />
          <Link to={`/profile/${props.personData.userName}`}>
            <Button variant="outline-secondary" style={{ marginLeft: '10px', borderRadius: '8px', marginRight: '10px' }}>
              <IconContext.Provider
                value={{
                  className: 'global-class-name',
                  size: '25px',
                }}
              >
                <GrUser />
              </IconContext.Provider>
            </Button>
          </Link>
          {props.role === USER_ROLES.coach && (
          <Button variant="outline-secondary" style={{ borderRadius: '8px' }} onClick={handleShowModal}>
            <IconContext.Provider
              value={{
                className: 'global-class-name',
                size: '25px',
              }}
            >
              <FaEye />
            </IconContext.Provider>
            {' '}
            {Translate(messages.herTrainingPlans)}
          </Button>
          )}
        </Card.Footer>
      </Card>
      <TrainingPlansModal
        show={showModal}
        handleClose={handleCloseModal}
        firstName={props.personData.firstName}
        clientName={props.personData.userName}
      />
    </Aux>
  );
};

const mapStateToProps = (state) => ({
  currentUserName: state.auth.userName,
  role: state.auth.role,
});

export default connect(mapStateToProps)(personCard);
