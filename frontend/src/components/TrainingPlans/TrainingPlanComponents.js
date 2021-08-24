import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { GrAddCircle } from 'react-icons/gr';
import { IconContext } from 'react-icons';
import TrainingPlanNavigation from '../Navigation/TrainingPlans/TrainingPlanNavigation';
import Spinner from '../UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import UpdateExerciseModal from '../UI/Modal/UpdateExerciseModal';
import TableExercises from './Table/TableExercises';
import TrainingPlanBuilder from './TrainingPlanBuilder';
import './TrainingPlanComponents.css';
import '../Styles/Button.css';
import Translate from '../../i18n/translate';
import FeedbackWrapper from '../UI/Feedback/FeedbackWrapper';
import { VARIANT_TYPES } from '../../types/variantTypes';

const messages = {
  exerciseId: 'newTrainingPlan_exercise',
  setsId: 'newTrainingPlan_sets',
  repsId: 'newTrainingPlan_reps',
  removeId: 'newTrainingPlan_remove',
  weightId: 'newTrainingPlan_weight',
  addId: 'newTrainingPlan_add',
  saveId: 'newTrainingPlan_saveTrainingPlan',
  weightPlaceholderId: 'newTrainingPlan_weightPlaceholder',
  exercisePlaceholderId: 'newTrainingPlan_exercisePlaceholder',
  tableEmptyId: 'newTrainingPlan_tableEmpty',
  exerciseListEmpty: 'newTrainingPlan_exerciseListEmpty',
  successfulTPSubmit: 'newTrainingPlan_successfulTPSubmit',
  unsuccessfulTPSubmit: 'newTrainingPlan_unsuccessfulTPSubmit',
};

const trainingPlanComponents = (props) => {
  let table = <Spinner />;
  // canBeModified = itt nemcsak megjelenitjuk a gyakorlatokat, hanem modosithatjuk oket
  if (props.exercises.length > 0) {
    table = (
      <Aux>
        {props.selectedExercises !== null
          && (
          <TableExercises
            canBeModified
            selectedExercises={props.selectedExercises}
            handleRemove={props.handlers.handleRemove}
            handleEdit={props.handlers.handleEdit}
          />
          )}
        {props.selectedExercises.length === 0 && (
        <IconContext.Provider
          value={{
            color: '#08457e',
            className: 'global-class-name',
            size: '30px',
          }}
        >
          <Row>
            <Col md={{ span: 1, offset: 3 }}>
              <GrAddCircle />
            </Col>
            <Col md={{ span: 2, offset: 0 }}>
              {Translate(messages.tableEmptyId)}
            </Col>
          </Row>
        </IconContext.Provider>
        )}
      </Aux>
    );
  } else if (!props.loading && props.exercises.length === 0) {
    table = (
      <Row>
        <Col md={{ span: 1, offset: 3 }}>
          <GrAddCircle />
        </Col>
        <Col md={{ span: 2, offset: 0 }}>
          {Translate(messages.exerciseListEmpty)}
        </Col>
      </Row>
    );
  }

  return (
    <div style={{ marginTop: '28px', margin: '30px' }}>
      { // a navigaciós sávot (új edzésterv, meglévök, új gyak) csak akkor jelenítjük meg,
        // ha új edzéstervet szúrunk be, szerkesztésnél más a navigációs sáv
        props.isNewTrainingPlan && <TrainingPlanNavigation />
      }
      {props.error
        ? (
          <FeedbackWrapper
            variant={VARIANT_TYPES.danger}
            messageId={messages.unsuccessfulTPSubmit}
            showFeedback={props.showFeedback}
          />
        ) : null}
      {props.successful
        ? (
          <FeedbackWrapper
            variant={VARIANT_TYPES.succes}
            messageId={messages.successfulTPSubmit}
            showFeedback={props.showFeedback}
          />
        ) : null}
      <div style={{ marginTop: '28px', overflow: 'auto', height: '400px' }}>
        {table}
        <UpdateExerciseModal
          showModal={props.showModal}
          handleClose={props.handlers.handleCloseModal}
          reps={props.exerciseForEdit.reps}
          sets={props.exerciseForEdit.sets}
          weight={props.exerciseForEdit.weight}
          index={props.exerciseForEdit.index}
          handleChangesFromEdit={props.handlers.handleChangesFromEdit}
        />
      </div>
      <TrainingPlanBuilder
        exercises={props.exercises}
        sets={props.sets}
        repetitions={props.repetitions}
        weight={props.weight}
        selectedExercise={props.selectedExercise}
        selectedExercises={props.selectedExercises}
        handleSelectedExercise={props.handlers.handleSelectedExercise}
        handleSetsRangeSlider={props.handlers.handleSetsRangeSlider}
        handleRepsRangeSlider={props.handlers.handleRepsRangeSlider}
        handleWeightChange={props.handlers.handleWeightChange}
        handleAdd={props.handlers.handleAdd}
        handleSubmit={props.handlers.handleSubmit}
      />
    </div>
  );
};

export default trainingPlanComponents;
