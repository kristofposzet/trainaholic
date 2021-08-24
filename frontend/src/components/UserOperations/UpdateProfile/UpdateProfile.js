import React, { useEffect, useState } from 'react';
import {
  Form, Button, Image, Container, Col, Row,
} from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import '../../Styles/Button.css';
import { connect } from 'react-redux';
import { IMAGE_SRC } from '../../../types/imagesByGender';
import Translate from '../../../i18n/translate';
import * as actions from '../../../store/actions/index';
import { messages } from '../../Common/messages';
import './UpdateProfile.css';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import { VARIANT_TYPES } from '../../../types/variantTypes';
import FeedbackWrapper from '../../UI/Feedback/FeedbackWrapper';

const updateProfileSchema = Yup.object().shape({
  password: Yup.string()
    .max(30, messages.passwordTooLongId)
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      messages.passwordMatchesId,
    )
    .required(messages.requiredFieldId),
  passwordAgain: Yup.string()
    .max(30, messages.passwordTooLongId)
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      messages.passwordMatchesId,
    )
    .oneOf([Yup.ref('password'), null], messages.passwordMustMatchId)
    .required(messages.requiredFieldId),

  firstName: Yup.string()
    .matches(
      /^[A-ZÁÉÍÚÜŐŰ][a-záéúíóüőöű]+$/,
      messages.invalidFirstNameId,
    )
    .max(20, messages.invalidFirstNameId)
    .required(messages.requiredFieldId),

  lastName: Yup.string()
    .matches(
      /^[A-ZÁÉÍÚÜŐŰ][a-záéúíóüőöű]+$/,
      messages.invalidLastNameId,
    )
    .max(30, messages.invalidLastNameId)
    .required(messages.requiredFieldId),
  cityName: Yup.string()
    .matches(
      /^[A-ZÁÉÍÚÜŐŰ][a-záéúíóüőű]+.*$/,
      messages.invalidCityNameId,
    )
    .required(messages.requiredFieldId),
  email: Yup.string()
    .matches(
      /\S+@\S+\.\S+/,
      messages.invalidEmailId,
    )
    .required(messages.requiredFieldId),
  oldPassword: Yup.string()
    .max(30, messages.passwordTooLongId)
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      messages.passwordMatchesId,
    )
    .required(messages.requiredFieldId),
  telephoneNumber: Yup.number().typeError(messages.phoneMustBeId),
});

const updateProfile = (props) => {
  const [fileName, setFileName] = useState('Válasszon fényképet');
  const [fileForUpdate, setFileForUpdate] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userInformations, setUserInformations] = useState({
    firstName: '', lastName: '', email: '', regionName: '', cityName: '', countryName: '', description: '', workplace: '', telephoneNumber: '',
  });
  const [localityChanged, setLocalityChanged] = useState(false);
  const [profileInfosChanged, setProfileInfosChanged] = useState(false);
  const FIELD_NAME = 'profileImg';
  const intl = useIntl();

  useEffect(() => {
    // a válasz típusa egy file lesz --> blob
    axios.get('/api/profilePicture', { responseType: 'blob' })
      .then((resp) => {
        if (resp.data.type === 'text/html') {
          // ha nincs kép elmentve, megnézzük a felhasználó nemét
          // size(male) === 4, size(female) === 6
          if (resp.data.size === 4) {
            setProfilePicture(IMAGE_SRC.male);
          } else {
            setProfilePicture(IMAGE_SRC.female);
          }
        } else {
          // a file-kent elkuldott valaszbol keszitunk egy URL-t, hogy beállíthassuk a kép src-nek
          setProfilePicture(window.URL.createObjectURL(resp.data));
        }
      })
      .catch(() => setProfilePicture(IMAGE_SRC.err));
    axios.get('/api/users/personalInformations')
      .then((resp) => {
        const {
          firstName, lastName, email, regionName, cityName, countryName,
        } = resp.data;
        const userInfos = {
          firstName,
          lastName,
          email,
          regionName,
          cityName,
          countryName,
          workplace: resp.data.workplace ? resp.data.workplace : '',
          description: resp.data.description ? resp.data.description : '',
          telephoneNumber: resp.data.phoneNumber ? resp.data.phoneNumber : '',
        };
        setUserInformations(userInfos);
      })
      .catch((err) => {
        props.onError(err);
        props.onCloseFeedback();
      });
  }, []);

  const handleUpdateProfilePicture = () => {
    // file átvitelre multipart/form-data-t küldünk
    const formData = new FormData();
    formData.append(FIELD_NAME, fileForUpdate, fileName);
    axios.put('/api/profilePicture', formData, { responseType: 'blob' })
      .then((resp) => {
        props.onSuccess();
        props.endLoad();
        props.onCloseFeedback();
        setProfilePicture(window.URL.createObjectURL(resp.data));
        setFileForUpdate(null);
      })
      .catch((err) => {
        setProfilePicture(IMAGE_SRC.err);
        props.onError(err);
        props.onCloseFeedback();
      });
  };

  const handleUpdateProfileInformations = (userInfos) => {
    axios.patch('/api/users/userData', userInfos)
      .then(() => {
        props.onSuccess();
        props.endLoad();
        props.onCloseFeedback();
      })
      .catch((err) => {
        props.onError(err);
        props.onCloseFeedback();
      });
  };

  const handleUpdatePassword = (newPassword, oldPassword) => {
    const passwords = {
      oldPassword,
      newPassword,
    };
    props.onLoad();
    axios.patch('/api/users/password', passwords)
      .then(() => {
        props.onSuccess();
        props.endLoad();
        props.onCloseFeedback();
      })
      .catch((err) => {
        props.onError(err);
        props.onCloseFeedback();
      });
  };

  const handleUpdateLocality = (newCityName) => {
    const newResidence = {
      countryName: userInformations.countryName,
      regionName: userInformations.regionName,
      cityName: newCityName,
    };
    axios.patch('/api/users/locality', newResidence)
      .then(() => {
        props.onSuccess();
        props.endLoad();
        props.onCloseFeedback();
      })
      .catch((err) => {
        props.onError(err);
        props.onCloseFeedback();
      });
  };

  return (
    <Aux>
      {props.error
        ? (
          <FeedbackWrapper
            variant={VARIANT_TYPES.danger}
            messageId={messages.unsuccessfulOperationUpdateId}
            showFeedback={props.showFeedback}
          />
        ) : null}
      {props.successful
        ? (
          <FeedbackWrapper
            variant={VARIANT_TYPES.succes}
            messageId={messages.successfulOperationUpdateId}
            showFeedback={props.showFeedback}
          />
        ) : null}
      <Formik
        initialValues={{
          firstName: userInformations.firstName,
          lastName: userInformations.lastName,
          email: userInformations.email,
          cityName: userInformations.cityName,
          password: '',
          passwordAgain: '',
          oldPassword: '',
          description: userInformations.description,
          workplace: userInformations.workplace,
          telephoneNumber: userInformations.telephoneNumber,
        }}
        validationSchema={updateProfileSchema}
        enableReinitialize
      >
        {(formik) => {
          const {
            errors,
            touched,
            values,
            handleChange,
            handleBlur,
          } = formik;
          return (
            <Container style={{ marginTop: '40px' }}>
              <Row>
                <Col lg={6} xs={30}>
                  <div className="Outer" style={{ width: '80%' }}>
                    <div className="Inner">
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
                      <Form.Group style={{ marginTop: '15px' }}>
                        <Form.File
                          id="custom-file-profile-update"
                          label={fileName}
                          data-browse={intl.formatMessage({ id: messages.imagebrowseId })}
                          custom
                          onChange={(e) => {
                            if (e.target.files[0].size < 5242880) {
                              /* a feltoltott file:az elso elem */
                              setFileName(e.target.files[0].name);
                              setFileForUpdate(e.target.files[0]);
                            } else {
                              setFileName(intl.formatMessage({ id: messages.maxSizeId }));
                              props.onError('Max size: 5MB');
                              props.onCloseFeedback();
                            }
                          }}
                        />
                      </Form.Group>
                      <Button
                        className="Button"
                        disabled={fileForUpdate === null}
                        onClick={() => handleUpdateProfilePicture()}
                      >
                        {Translate(messages.updateProfPicId)}
                      </Button>
                    </div>
                  </div>
                  <br />
                  <div className="Outer" style={{ width: '80%', marginBottom: '30px' }}>
                    <div className="Inner">
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.oldPasswordId)}
                        </Form.Label>
                        <Form.Control
                          name="oldPassword"
                          placeholder={intl.formatMessage({ id: messages.passwordPlaceHolderId })}
                          type="password"
                          value={values.oldPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.oldPassword && touched.oldPassword ? (<div className="Feedback">{Translate(errors.oldPassword)}</div>)
                          : null}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.newPasswordUpdateId)}
                        </Form.Label>
                        <Form.Control
                          name="password"
                          placeholder={intl.formatMessage({ id: messages.passwordPlaceHolderId })}
                          type="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.password && touched.password ? (<div className="Feedback">{Translate(errors.password)}</div>)
                          : null}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.newPasswordAgainId)}
                        </Form.Label>
                        <Form.Control
                          name="passwordAgain"
                          placeholder={intl.formatMessage(
                            { id: messages.passwordAgainPlaceHolderId },
                          )}
                          type="password"
                          value={values.passwordAgain}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.passwordAgain && touched.passwordAgain ? (<div className="Feedback">{Translate(errors.passwordAgain)}</div>)
                          : null}
                      </Form.Group>
                      <Button
                        className="Button"
                        onClick={() => handleUpdatePassword(values.password, values.oldPassword)}
                        disabled={values.oldPassword === '' || values.password === '' || values.passwordAgain === ''
                      || errors.oldPassword || errors.passwordAgain || errors.password}
                      >
                        {Translate(messages.updatePasswordId)}
                      </Button>
                    </div>
                  </div>
                </Col>
                <Col lg={4} xs={10}>
                  <div className="Outer" style={{ width: '130%' }}>
                    <div className="Inner">
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.countryId)}
                        </Form.Label>
                        <div style={{ padding: '0 1px' }}>
                          <CountryDropdown
                            value={userInformations.countryName}
                            classes="CountrySelector"
                            defaultOptionLabel={
                            intl.formatMessage({ id: messages.countryOptionLabelId })
                            }
                            onChange={(val) => {
                              setUserInformations((currentState) => ({
                                ...currentState,
                                countryName: val,
                                regionName: '',
                              }));
                              if (!localityChanged) {
                                setLocalityChanged(true);
                              }
                            }}
                          />
                        </div>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.regionId)}
                        </Form.Label>
                        <div style={{ padding: '0 1px' }}>
                          <RegionDropdown
                            defaultOptionLabel={
                              intl.formatMessage({ id: messages.regionOptionLabelId })
                            }
                            country={userInformations.countryName}
                            value={userInformations.regionName}
                            onChange={(val) => {
                              setUserInformations((currentState) => ({
                                ...currentState,
                                regionName: val,
                              }));
                              if (!localityChanged) {
                                setLocalityChanged(true);
                              }
                            }}
                          />
                        </div>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.cityNameId)}
                        </Form.Label>
                        <Form.Control
                          name="cityName"
                          type="text"
                          placeholder={
                              intl.formatMessage({ id: messages.byLanguageOfTheCountry })
                            }
                          value={values.cityName}
                          onChange={(e) => {
                            if (!localityChanged) {
                              setLocalityChanged(true);
                            }
                            handleChange(e);
                          }}
                        />
                        {errors.cityName ? (<div className="Feedback">{Translate(errors.cityName)}</div>)
                          : null}
                      </Form.Group>
                      <Button
                        className="Button"
                        disabled={!localityChanged || errors.cityName || userInformations.regionName === ''}
                        onClick={() => handleUpdateLocality(values.cityName)}
                      >
                        {Translate(messages.placeOfResidenceId)}
                      </Button>
                    </div>
                  </div>
                  <br />
                  <div className="Outer" style={{ width: '130%' }}>
                    <div className="Inner">
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.firstNameId)}
                        </Form.Label>
                        <Form.Control
                          name="firstName"
                          placeholder={
                              intl.formatMessage({ id: messages.firstNamePlaceholderId })
                            }
                          type="text"
                          value={values.firstName}
                          onChange={(e) => {
                            handleChange(e);
                            if (!profileInfosChanged) {
                              setProfileInfosChanged(true);
                            }
                          }}
                        />
                        {errors.firstName ? (<div className="Feedback">{Translate(errors.firstName)}</div>)
                          : null}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.lastNameId)}
                        </Form.Label>
                        <Form.Control
                          name="lastName"
                          placeholder={intl.formatMessage({ id: messages.lastNamePlaceHolderId })}
                          type="text"
                          value={values.lastName}
                          onChange={(e) => {
                            handleChange(e);
                            if (!profileInfosChanged) {
                              setProfileInfosChanged(true);
                            }
                          }}
                        />
                        {errors.lastName ? (<div className="Feedback">{Translate(errors.lastName)}</div>)
                          : null}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.emailId)}
                        </Form.Label>
                        <Form.Control
                          name="email"
                          placeholder={intl.formatMessage({ id: messages.emailId })}
                          type="text"
                          value={values.email}
                          onChange={(e) => {
                            handleChange(e);
                            if (!profileInfosChanged) {
                              setProfileInfosChanged(true);
                            }
                          }}
                        />
                        {errors.email ? (<div className="Feedback">{Translate(errors.email)}</div>)
                          : null}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.phoneNumberId)}
                        </Form.Label>
                        <Form.Control
                          name="telephoneNumber"
                          placeholder={intl.formatMessage({ id: messages.phoneNumberId })}
                          type="text"
                          value={values.telephoneNumber}
                          onChange={(e) => {
                            handleChange(e);
                            if (!profileInfosChanged) {
                              setProfileInfosChanged(true);
                            }
                          }}
                        />
                        {errors.telephoneNumber ? (<div className="Feedback">{Translate(errors.telephoneNumber)}</div>)
                          : null}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.workplaceId)}
                        </Form.Label>
                        <Form.Control
                          name="workplace"
                          placeholder={intl.formatMessage({ id: messages.workplaceId })}
                          type="text"
                          value={values.workplace}
                          onChange={(e) => {
                            handleChange(e);
                            if (!profileInfosChanged) {
                              setProfileInfosChanged(true);
                            }
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.descriptionId)}
                        </Form.Label>
                        <Form.Control
                          name="description"
                          placeholder={intl.formatMessage({ id: messages.descriptionId })}
                          type="text"
                          value={values.description}
                          onChange={(e) => {
                            handleChange(e);
                            if (!profileInfosChanged) {
                              setProfileInfosChanged(true);
                            }
                          }}
                        />
                      </Form.Group>
                      <Button
                        className="Button"
                        disabled={!profileInfosChanged || errors.firstName
                        || errors.lastName || errors.email}
                        onClick={() => handleUpdateProfileInformations({
                          firstName: values.firstName,
                          lastName: values.lastName,
                          email: values.email,
                          description: values.description,
                          workplace: values.workplace,
                          phoneNumber: values.telephoneNumber,
                        })}
                      >
                        {Translate(messages.updateDatasId)}
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          );
        }}
      </Formik>
    </Aux>
  );
};

const mapStateToProps = (state) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(updateProfile);
