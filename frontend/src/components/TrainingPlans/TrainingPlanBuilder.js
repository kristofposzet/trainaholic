import React from 'react';
import Select from 'react-select';
import {
  Row, Col, Button, Form,
} from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import { FormattedMessage } from 'react-intl';
import Translate from '../../i18n/translate';

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

const trainingPlanBuilder = (props) => (
  <div className="TrainingPlan">
    <Row style={{ margin: '20px' }}>
      <Col md={{ span: 3, offset: 0 }} xs={{ span: 12, offset: 0 }}>
        <h4>{Translate(messages.exerciseId)}</h4>
        {props.exercises.length > 0
        && (
        <Select
          options={
          // eslint-disable-next-line no-underscore-dangle
          props.exercises.map((exercise) => ({ value: exercise._id, label: exercise.name }))
        }
          onChange={(e) => props.handleSelectedExercise(e)}
          placeholder={<FormattedMessage id={messages.exercisePlaceholderId} />}
        />
        ) }
      </Col>
      <Col md={{ span: 3, offset: 0 }} xs={{ span: 12, offset: 0 }}>
        <h4>{Translate(messages.setsId)}</h4>
        <RangeSlider
          size="lg"
          value={props.sets}
          min={1}
          max={30}
          onChange={
                (changeEvent) => props.handleSetsRangeSlider(+changeEvent.target.value)
              }
        />
      </Col>
      <Col md={{ span: 3, offset: 0 }} xs={{ span: 12, offset: 0 }}>
        <h4>{Translate(messages.repsId)}</h4>
        <RangeSlider
          size="lg"
          value={props.repetitions}
          min={1}
          max={30}
          onChange={
                (changeEvent) => props.handleRepsRangeSlider(+changeEvent.target.value)
              }
        />
      </Col>
      <Row>
        <Col md={{ span: 7, offset: 0 }} xs={{ span: 9, offset: 0 }}>
          <h4>{Translate(messages.weightId)}</h4>
          <Form.Control
            name="na"
            type="number"
            min={0}
            value={props.weight}
            max={600}
            onChange={(changeEvent) => props.handleWeightChange(+changeEvent.target.value)}
          />
        </Col>
        <Col md={{ span: 3, offset: 2 }} xs={{ span: 6, offset: 3 }}>
          <Button
            className="Button"
            style={{ marginTop: '35px', width: '100px' }}
            disabled={props.selectedExercise.label === null || props.weight < 0}
            onClick={props.handleAdd}
          >
            {Translate(messages.addId)}
          </Button>
        </Col>
      </Row>

    </Row>
    <Col md={{ span: 4, offset: 5 }} xs={{ offset: 1 }}>
      <Button
        className="Button"
        disabled={props.selectedExercises.length === 0}
        style={{ width: '200px', height: '60px' }}
        onClick={props.handleSubmit}
      >
        {Translate(messages.saveId)}
      </Button>
    </Col>
  </div>
);

export default trainingPlanBuilder;
