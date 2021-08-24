import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import {
  Row, Col, Form, Button,
} from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import Translate from '../../../i18n/translate';
import '../../Styles/Button.css';

const messages = {
  setsId: 'newTrainingPlan_sets',
  repsId: 'newTrainingPlan_reps',
  weightId: 'newTrainingPlan_weight',
  saveId: 'newTrainingPlan_saveTrainingPlan',
  modalTitle: 'newTrainingPlan_modalTitle',
};

const updateExerciseModal = (props) => {
  const [reps, setReps] = useState(1);
  const [sets, setSets] = useState(1);
  const [weight, setWeight] = useState(0);

  // useState(props.barmi) - nem mukodik, mert csak legeloszor hivodik meg
  // kell a useEffect es meg kell adni tombben a props-ok ertekeit, hogy
  // amikor valtozast eszlel, akkor update-elje az ertekeket
  useEffect(() => {
    setReps(props.reps);
    setSets(props.sets);
    setWeight(props.weight);
  }, [props.reps, props.sets, props.weight]);

  return (
    <Modal show={props.showModal} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{Translate(messages.modalTitle)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <h4>{Translate(messages.repsId)}</h4>
          </Col>
          <Col>
            <RangeSlider
              size="lg"
              value={reps}
              min={1}
              max={30}
              onChange={(changeEvent) => {
                changeEvent.preventDefault();
                setReps(+changeEvent.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>{Translate(messages.setsId)}</h4>
          </Col>
          <Col>
            <RangeSlider
              size="lg"
              value={sets}
              min={1}
              max={30}
              onChange={(changeEvent) => {
                changeEvent.preventDefault();
                setSets(+changeEvent.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>{Translate(messages.weightId)}</h4>
          </Col>
          <Col>
            <Form.Control
              type="number"
              min={0}
              value={weight}
              max={600}
              onChange={(changeEvent) => {
                changeEvent.preventDefault();
                setWeight(+changeEvent.target.value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className="text-center" style={{ width: '100%', alignItems: 'center' }}>
          <Button
            className="Button"
            variant="primary"
            onClick={() => props.handleChangesFromEdit({
              reps,
              sets,
              weight,
              index: props.index,
            })}
          >
            Módosítás
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default updateExerciseModal;
