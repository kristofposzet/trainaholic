import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Row, Image, Container, Form, Col, Button,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { FaQuestionCircle, FaPhoneAlt } from 'react-icons/fa';

import { IMAGE_SRC } from '../../types/imagesByGender';
import { USER_ROLES } from '../../types/userRoles';
import '../UserOperations/UpdateProfile/UpdateProfile.css';
import Translate from '../../i18n/translate';
import ContactComponent from '../Common/ContactComponent';
import Comments from './Comments';
import FeedbackWrapper from '../UI/Feedback/FeedbackWrapper';
import Spinner from '../UI/Spinner/Spinner';
import { VARIANT_TYPES } from '../../types/variantTypes';
import * as actions from '../../store/actions/index';

const messages = {
  firstNameId: 'register_firstName',
  lastNameId: 'register_lastName',
  countryId: 'register_country',
  countyId: 'profile_county',
  locationId: 'profile_location',
  workplaceId: 'profile_workplace',
  descriptionId: 'profile_description',
  unsuccessfulId: 'profile_unsuccessful',
  phoneNumberId: 'profile_phoneNumber',
  notSpecifiedId: 'commonMessages_notSpecified',
};

const profile = (props) => {
  const { userName } = props.match.params;
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [userInformations, setUserInformations] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    cityName: '',
    countryName: '',
    countyName: '',
    comments: {},
    description: '',
    workplace: '',
    role: 0,
    phoneNumber: null,
  });

  useEffect(() => {
    props.onLoad();
    axios.get(`/api/profilePicture/${userName}`, { responseType: 'blob' })
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
        props.onSuccess();
        props.endLoad();
        props.onCloseFeedback();
      })
      .catch((err) => {
        setProfilePicture(IMAGE_SRC.err);
        props.onError(err);
        props.onCloseFeedback();
      });
    axios.get(`/api/profile/${userName}`)
      .then((resp) => {
        setUserInformations({ ...resp.data });
      })
      .catch((err) => {
        props.onError(err);
        props.onCloseFeedback();
      });
  }, []);

  return (
    <Container style={{ marginTop: '30px' }}>
      {props.error
        ? (
          <FeedbackWrapper
            variant={VARIANT_TYPES.danger}
            messageId={messages.unsuccessfulId}
            showFeedback={props.showFeedback}
          />
        ) : null}
      {props.loading ? (
        <Spinner />
      ) : (
        <Row lg={12} xs={12}>
          <Col lg={4} xs={12} style={{ marginBottom: '10px' }}>
            <div className="Outer">
              <div className="Inner">
                <Row>
                  {profilePicture
              && (
                <Image
                  style={{
                    width: '15vw', height: '15vw', objectFit: 'cover', display: 'block', marginLeft: 'auto', marginRight: 'auto',
                  }}
                  src={profilePicture}
                  roundedCircle
                  className="ProfilePic"
                />
              )}
                </Row>
                <Row className="justify-content-md-center" style={{ marginTop: '20px' }}>
                  <h4>
                    {userInformations.firstName}
                    {' '}
                    {userInformations.lastName}
                  </h4>
                </Row>
                <hr />
                <Row className="justify-content-md-center">
                  <ContactComponent
                    personData={userInformations}
                    userName={props.userName}
                  />
                </Row>
              </div>
            </div>
          </Col>
          <Col lg={8} xs={12}>
            <div className="Outer">
              <div className="Inner">
                <Row>
                  <Col>
                    <Form.Label className="font-weight-bold">
                      {Translate(messages.phoneNumberId)}
                      {':'}
                    </Form.Label>
                  </Col>
                  <Col>
                    <Button variant="outline-secondary" onClick={() => setShowPhoneNumber(!showPhoneNumber)}>
                      <FaPhoneAlt />
                      {' '}
                      {userInformations.phoneNumber && (
                        !showPhoneNumber ? `${userInformations.phoneNumber.slice(0, -(userInformations.phoneNumber.length - 3))}*******`
                          : userInformations.phoneNumber
                      )}
                      {!userInformations.phoneNumber && Translate(messages.notSpecifiedId)}
                    </Button>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <Form.Label className="font-weight-bold">
                      {Translate(messages.countryId)}
                      {':'}
                    </Form.Label>
                  </Col>
                  <Col>
                    {userInformations.countryName}
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <Form.Label className="font-weight-bold">
                      {Translate(messages.countyId)}
                    </Form.Label>
                  </Col>
                  <Col>
                    {userInformations.countyName}
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <Form.Label className="font-weight-bold">
                      {Translate(messages.locationId)}
                    </Form.Label>
                  </Col>
                  <Col>
                    {userInformations.cityName}
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <Form.Label className="font-weight-bold">
                      {Translate(messages.workplaceId)}
                      {':'}
                    </Form.Label>
                  </Col>
                  <Col>
                    {userInformations.workplace
                      ? userInformations.workplace : <FaQuestionCircle />}
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <Form.Label className="font-weight-bold">
                      {Translate(messages.descriptionId)}
                      {':'}
                    </Form.Label>
                  </Col>
                  <Col>
                    {userInformations.description
                      ? userInformations.description : <FaQuestionCircle />}
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      )}
      { userInformations.role === USER_ROLES.coach
      && (
        <Row lg={10} md={8} xs={8} style={{ marginTop: '30px' }}>
          <div className="Outer">
            <div className="Inner" style={{ width: '85%' }}>
              <Comments
                opinions={userInformations.comments}
                fromUserName={userInformations.userName}
                currentUserName={props.userName}
                profileUserName={userName}
              />
            </div>
          </div>
        </Row>
      )}
    </Container>
  );
};

const mapStateToProps = (state) => ({
  userName: state.auth.userName,
  role: state.auth.role,
  loading: state.inputFeedback.loading,
  error: state.inputFeedback.error,
  showFeedback: state.inputFeedback.show,
  successful: state.inputFeedback.successful,
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: () => dispatch(actions.startLoading()),
  endLoad: () => dispatch(actions.endLoading()),
  onError: (err) => dispatch(actions.errorFeedback(err)),
  onCloseFeedback: () => setTimeout(() => {
    dispatch(actions.closeFeedback());
  }, 3000),
  onSuccess: () => dispatch(actions.successfulFeedback()),
});
export default connect(mapStateToProps, mapDispatchToProps)(profile);
