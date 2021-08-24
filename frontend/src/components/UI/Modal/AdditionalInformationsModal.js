import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import {
  Button,
} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useIntl } from 'react-intl';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { IMAGES } from '../../../types/trainingPlanImages';
import { IMAGE_ID_S } from '../../../types/imageIdentifiers';
import Translate from '../../../i18n/translate';
import '../../Styles/Button.css';
import 'react-datepicker/dist/react-datepicker.css';

const messages = {
  okId: 'commonMessages_okId',
  addClientsId: 'additionalInfoModal_addClients',
  editClientsId: 'additionalInfoModal_editClients',
  laterId: 'additionalInfoModal_later',
  oneLastStepId: 'additionalInfoModal_oneLastStep',
  executionDateId: 'additionalInfoModal_date',
  nameOfTrainingPlan: 'additionalInfoModal_name',
  selectImgId: 'additionalInfoModal_selecImg',
  imgLabel: 'additionalInfoModal_imgLabel',
};

const currentDate = new Date();

const additionalInformationsModal = (props) => {
  const [trainingDate, setTrainingDate] = useState(currentDate);
  const [trainingPlanName, setTrainingPlanName] = useState('');
  const [selectedImage, setSelectedImage] = useState(IMAGE_ID_S.singleWeight);
  // ha észleli, hogy a dátum, kép id és a név meg volt adva props-ként,
  // akkor a state-ek felveszik ezeket
  useEffect(() => {
    if (props.trainingDate) {
      setTrainingDate(props.trainingDate);
    }
    if (props.trainingPlanName) {
      setTrainingPlanName(props.trainingPlanName);
    }
    if (props.selectedImage) {
      setSelectedImage(props.selectedImage);
    }
  }, [props.trainingDate, props.trainingPlanName, props.selectedImage]);
  const intl = useIntl();

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{Translate(messages.oneLastStepId)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label className="font-weight-bold">
            {Translate(messages.nameOfTrainingPlan)}
          </Form.Label>
          <Form.Control
            name="userName"
            placeholder={intl.formatMessage({ id: messages.nameOfTrainingPlan })}
            type="text"
            value={trainingPlanName}
            onChange={(event) => setTrainingPlanName(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="font-weight-bold">
            {Translate(messages.executionDateId)}
          </Form.Label>
          {/* https://www.npmjs.com/package/react-datepicker */}
          <DatePicker
            selected={trainingDate}
            onChange={(date) => setTrainingDate(date)}
            showTimeSelect
            minDate={currentDate}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="font-weight-bold">
            {Translate(messages.imgLabel)}
          </Form.Label>
          <Select
            options={
            IMAGES.map((image) => ({ value: image.key, label: image }))
          }
            onChange={(e) => setSelectedImage(e.value)}
            placeholder={intl.formatMessage({ id: messages.selectImgId })}
          />
        </Form.Group>

        <Form.Label className="font-weight-bold">
          {Translate(props.isNewTrainingPlan ? messages.addClientsId : messages.editClientsId)}
        </Form.Label>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          style={{ borderRadius: '8px' }}
          onClick={() => {
            props.handleSaveTrainingPlan(trainingDate, trainingPlanName, selectedImage, false);
            setTrainingPlanName('');
            setTrainingDate(currentDate);
          }}
          disabled={trainingPlanName === ''}
        >
          {Translate(messages.laterId)}
        </Button>
        <Button
          className="Button"
          onClick={() => {
            props.handleSaveTrainingPlan(trainingDate, trainingPlanName, selectedImage, true);
            setTrainingPlanName('');
            setTrainingDate(currentDate);
          }}
          disabled={trainingPlanName === ''}
        >
          {Translate(messages.okId)}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default additionalInformationsModal;
