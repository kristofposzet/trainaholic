import React from 'react';
import Form from 'react-bootstrap/Form';
import {
  Row, Col, Button, Container,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import Spinner from '../../UI/Spinner/Spinner';
import '../../Styles/UICheckFeedback.css';
import Translate from '../../../i18n/translate';
import Feedback from '../../UI/Feedback/UIFeedback';
import '../../Styles/Button.css';
import * as actions from '../../../store/actions/index';
import { VARIANT_TYPES } from '../../../types/variantTypes';

const messages = {
  userNameId: 'user_userName',
  passwordId: 'user_password',
  userNameMatchesId: 'yup_userNameMatches',
  userNameTooShortId: 'yup_userNameMin',
  userNameTooLongId: 'yup_userNameTooLong',
  requiredFieldId: 'yup_requiredField',
  passwordTooLongId: 'yup_passwordTooLong',
  passwordMatchesId: 'yup_passwordMatches',
  loginId: 'login_login',
  loginUnsuccessfulId: 'login_unsuccessFul',
  userNamePlaceholderId: 'login_userNamePlaceholder',
  passwordPlaceholderId: 'login_passwordPlaceholder',
};

const LoginSchema = Yup.object().shape({

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

});

const login = (props) => {
  const intl = useIntl();
  return (
    <div>
      <Formik
        initialValues={{
          userName: '',
          password: '',
        }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          const user = {
            userName: values.userName,
            password: values.password,
            role: props.role,
          };
          props.onAuth(user.userName, user.password, user.role);
          props.onCloseFeedback();
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
          return (!props.loading
            ? (
              <form
                action=""
                onSubmit={handleSubmit}
                style={{ margin: '50px' }}
              >
                {props.error
                  ? (
                    <Container>
                      <Row className="justify-content-md-center mt-5">
                        <Col lg="8" xs>
                          <Feedback
                            show={props.showFeedback}
                            variant={VARIANT_TYPES.danger}
                            messageId={messages.loginUnsuccessfulId}
                          />
                        </Col>
                      </Row>
                    </Container>
                  ) : null}
                <Row className="Content">
                  <Col>
                    <Form.Group controlId="formGridUsername">
                      <Form.Label className="font-weight-bold">
                        {Translate(messages.userNameId)}
                      </Form.Label>
                      <Form.Control
                        name="userName"
                        placeholder={intl.formatMessage({ id: messages.userNamePlaceholderId })}
                        type="text"
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
                    <Form.Group controlId="formGridPassword">
                      <Form.Label className="font-weight-bold">
                        {Translate(messages.passwordId)}
                      </Form.Label>
                      <Form.Control
                        name="password"
                        placeholder={intl.formatMessage({ id: messages.passwordPlaceholderId })}
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.password && touched.password ? (<div className="Feedback">{Translate(errors.password)}</div>)
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
                        {Translate(messages.loginId)}
                      </Button>
                    </Form.Group>
                  </Col>
                </Row>
              </form>
            ) : (
              <Spinner />
            )
          );
        }}
      </Formik>
    </div>
  );
};
const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  error: state.auth.error,
  showFeedback: state.inputFeedback.show,
});

const mapDispatchToProps = (dispatch) => ({
  onAuth: (userName, password, role) => dispatch(actions.auth(userName, password, role)),
  onCloseFeedback: () => setTimeout(() => {
    dispatch(actions.closeFeedback());
  }, 3000),
});

export default connect(mapStateToProps, mapDispatchToProps)(login);
