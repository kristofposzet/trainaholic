import React from 'react';
import Form from 'react-bootstrap/Form';
import {
  Row, Col, Button,
} from 'react-bootstrap';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import '../../Styles/UICheckFeedback.css';
import Translate from '../../../i18n/translate';
import '../../Styles/Button.css';
import * as actions from '../../../store/actions/index';
import Spinner from '../../UI/Spinner/Spinner';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import FeedbackWrapper from '../../UI/Feedback/FeedbackWrapper';
import { VARIANT_TYPES } from '../../../types/variantTypes';
import './Register.css';
import { messages } from '../../Common/messages';

const registerSchema = Yup.object().shape({

  userName: Yup.string()
    .matches(
      /(?=.*?[a-z])/,
      messages.userNameMatchesId,
    )
    .min(4, messages.userNameTooShortId)
    .max(20, messages.userNameTooLongId)
    .required(messages.requiredFieldId),

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
    // We are able to reference the value of password with ref. We use the oneOf function to ensure
    // that passwordConfirmation either matches password or if it is left blank and matches null
    // then it passes the validation for the time being.
    .oneOf([Yup.ref('password'), null], messages.passwordMustMatchId)
    .required(messages.requiredFieldId),

  firstName: Yup.string()
    .matches(
      /^[A-ZÁÉÍÚÜŐŰ][a-záéúíóüöőű]+$/,
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
  city: Yup.string()
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
});

const register = (props) => {
  const { country } = props;
  const { region } = props;
  const intl = useIntl();

  return (
    <div>
      <Formik
        initialValues={{
          userName: '',
          firstName: '',
          lastName: '',
          password: '',
          country: 'Romania',
          region: '',
          city: '',
          passwordAgain: '',
          gender: 'male',
          email: '',
        }}
        validationSchema={registerSchema}
        onSubmit={(values) => {
          const user = {
            userName: values.userName,
            firstName: values.firstName,
            lastName: values.lastName,
            password: values.password,
            country: values.country,
            region: values.region,
            city: values.city,
            gender: values.gender,
            email: values.email,
            role: props.role,
          };
          props.onLoad();
          axios.post('/api/users', user)
            .then(() => {
              props.onSuccess();
              props.endLoad();
              props.onCloseFeedback();
            })
            .catch((err) => {
              props.onError(err);
              props.onCloseFeedback();
            });
        }}
      >
        {(formik) => {
          const {
            values,
            handleChange,
            errors,
            touched,
            handleBlur,
            handleSubmit,
          } = formik;
          return (
            <Aux>
              {props.error
                ? (
                  <FeedbackWrapper
                    variant={VARIANT_TYPES.danger}
                    messageId={messages.unsuccesfulRegId}
                    showFeedback={props.showFeedback}
                  />
                ) : null}
              {props.successful
                ? (
                  <FeedbackWrapper
                    variant={VARIANT_TYPES.succes}
                    messageId={messages.succesfulRegId}
                    showFeedback={props.showFeedback}
                  />
                ) : null}
              {props.loading ? (
                <Spinner />
              ) : (
                <form
                  action=""
                  onSubmit={handleSubmit}
                  style={{ margin: '50px' }}
                >
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.countryId)}
                        </Form.Label>
                        <CountryDropdown
                          value={country}
                          classes="CountrySelector"
                          defaultOptionLabel={
                            intl.formatMessage({ id: messages.countryOptionLabelId })
                          }
                          onChange={(val) => {
                            props.onSelectCountry(val);
                            values.country = val;
                          }}
                        />
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
                            country={country}
                            value={region}
                            onChange={(val) => {
                              props.onSelectRegion(val);
                              values.region = val;
                            }}
                          />
                        </div>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.cityNameId)}
                        </Form.Label>
                        <Form.Control
                          name="city"
                          type="text"
                          placeholder={intl.formatMessage({ id: messages.byLanguageOfTheCountry })}
                          value={values.city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.city && touched.city ? (<div className="Feedback">{Translate(errors.city)}</div>)
                          : null}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.userNameId)}
                        </Form.Label>
                        <Form.Control
                          name="userName"
                          type="text"
                          placeholder={intl.formatMessage({ id: messages.userNamePlaceholderId })}
                          value={values.userName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.userName && touched.userName ? (
                          <div className="Feedback">
                            {
                              Translate(errors.userName)
                            }
                          </div>
                        )
                          : null}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.firstNameId)}
                        </Form.Label>
                        <Form.Control
                          name="firstName"
                          placeholder={intl.formatMessage({ id: messages.firstNamePlaceholderId })}
                          type="text"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.firstName && touched.firstName ? (<div className="Feedback">{Translate(errors.firstName)}</div>)
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.lastName && touched.lastName ? (<div className="Feedback">{Translate(errors.lastName)}</div>)
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.email && touched.email ? (<div className="Feedback">{Translate(errors.email)}</div>)
                          : null}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.genderId)}
                        </Form.Label>
                        <Row>
                          <Col>
                            <Form.Check
                              type="radio"
                              label={intl.formatMessage({ id: messages.maleId })}
                              name="formCheckRadio"
                              id="formCheckMale"
                              onClick={() => { values.gender = 'male'; }}
                            />
                          </Col>
                          <Col>
                            <Form.Check
                              type="radio"
                              label={intl.formatMessage({ id: messages.femaleId })}
                              name="formCheckRadio"
                              id="formCheckFemale"
                              onClick={() => { values.gender = 'female'; }}
                            />
                          </Col>
                        </Row>

                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="font-weight-bold">
                          {Translate(messages.passwordId)}
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
                          {Translate(messages.passwordAgainId)}
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
                      <Form.Group>
                        <Button
                          className="Button float-right"
                          variant="primary"
                          type="submit"
                          disabled={values.firstName === ''
                          || values.lastName === '' || values.password === '' || values.userName === ''}
                        >
                          {Translate(messages.registerId)}
                        </Button>
                      </Form.Group>
                    </Col>
                  </Row>
                </form>
              )}
            </Aux>
          );
        }}
      </Formik>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(register);
