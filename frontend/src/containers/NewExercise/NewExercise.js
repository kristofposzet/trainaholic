import React from 'react';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useIntl } from 'react-intl';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Translate from '../../i18n/translate';
import * as actions from '../../store/actions/index';
import '../../components/Styles/UICheckFeedback.css';
import '../../components/Styles/Button.css';
import FeedbackWrapper from '../../components/UI/Feedback/FeedbackWrapper';
import { VARIANT_TYPES } from '../../types/variantTypes';

const messages = {
  exerciseTooLongId: 'newExercise_exerciseTooLong',
  exerciseTooShortId: 'newExercise_exerciseTooShort',
  newExercisePlaceholderId: 'newExercise_newExercisePlaceholder',
  newExerciseNameId: 'newExercise_newExerciseName',
  requiredFieldId: 'yup_requiredField',
  saveId: 'commonMessages_save',
  selectedExerciseTypeId: 'newExercise_selectedExerciseTypeId',
  successFulSavedId: 'newExercise_successfulSaved',
  errorSavingExerciseId: 'newExercise_errorSavingExercise',
};

const newExerciseSchema = Yup.object().shape({

  exerciseName: Yup.string()
    .min(2, messages.exerciseTooShortId)
    .max(25, messages.exerciseTooLongId)
    .required(messages.requiredFieldId),
});

const NewExercise = (props) => {
  const intl = useIntl();
  return (
    <div>
      <Formik
        initialValues={{
          exerciseName: '',
        }}
        validationSchema={newExerciseSchema}
        onSubmit={(values) => {
          const exercise = {
            name: values.exerciseName,
            group: props.selected,
          };
          props.onLoad();
          axios.post('/api/exercises', exercise)
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
            <div style={{ marginTop: '60px' }}>
              {props.error
                ? (
                  <FeedbackWrapper
                    variant={VARIANT_TYPES.danger}
                    messageId={messages.errorSavingExerciseId}
                    showFeedback={props.showFeedback}
                  />
                ) : null}
              {props.successful
                ? (
                  <FeedbackWrapper
                    variant={VARIANT_TYPES.succes}
                    messageId={messages.successFulSavedId}
                    showFeedback={props.showFeedback}
                  />
                ) : null}
              <h3 style={{ margin: '70px' }}>
                {Translate(messages.selectedExerciseTypeId)}
                {'  '}
                {props.selected ? Translate(props.selected) : ''}
              </h3>
              <form
                action=""
                onSubmit={handleSubmit}
                style={{ margin: '70px' }}
              >
                <Form.Group>
                  <Form.Label className="font-weight-bold">
                    {Translate(messages.newExerciseNameId)}
                  </Form.Label>
                  <Form.Control
                    style={{ maxWidth: '600px' }}
                    name="exerciseName"
                    placeholder={intl.formatMessage(
                      { id: messages.newExercisePlaceholderId },
                    )}
                    type="text"
                    value={values.exerciseName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.exerciseName && touched.exerciseName ? (<div className="Feedback">{Translate(errors.exerciseName)}</div>)
                    : null}
                </Form.Group>
                <Form.Group>
                  <Button
                    className="Button float-left"
                    variant="primary"
                    type="submit"
                    disabled={values.exerciseName === ''}
                  >
                    {Translate(messages.saveId)}
                  </Button>
                </Form.Group>
              </form>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

NewExercise.propTypes = {
  onLoad: PropTypes.func,
  endLoad: PropTypes.func,
  onError: PropTypes.func,
  onCloseFeedback: PropTypes.func,
  onSuccess: PropTypes.func,
  selected: PropTypes.string,
  error: PropTypes.instanceOf(Object),
  showFeedback: PropTypes.bool,
  successful: PropTypes.bool,
};

NewExercise.defaultProps = {
  onLoad: null,
  endLoad: null,
  onError: null,
  onCloseFeedback: null,
  onSuccess: null,
  selected: null,
  error: null,
  showFeedback: null,
  successful: null,
};

const mapStateToProps = (state) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(NewExercise);
