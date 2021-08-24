/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Card, Button, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import { BiError } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import { FiAlertTriangle } from 'react-icons/fi';
import axios from 'axios';
import TrainingPlanModal from '../../../components/UI/Modal/TrainingPlanModal';
import WarningModal from '../../../components/UI/Modal/WarningModal';
import Translate from '../../../i18n/translate';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import '../../../components/Styles/Button.css';
import weightGreen from '../../../assets/images/trainingPlans/weightGreenColor.PNG';
import { IMAGES } from '../../../types/trainingPlanImages';

const messages = {
  atId: 'trainingPlanCard_at',
  showExercisesId: 'trainingPlanCard_show',
  editId: 'trainingPlanCard_edit',
  deleteId: 'commonMessages_delete',
  attachedClientsId: 'attachedClients_attachedClients',
  undoId: 'commonMessages_undo',
  attachId: 'attachedClients_attachClient',
  attachedId: 'attachedClients_attached',
  expiredTplanId: 'trainingPlanCard_expiredTplan',
};

class TrainingPlanCard extends Component {
  state = {
    showTrainingPlanModal: false,
    showDeleteModal: false,
    mouseHovered: false,
    attached: true,
    errorOccured: false,
  };

  getExercises = () => {
    const exercises = Object.entries(this.props.trainingPlan).map(([, exercise]) => (
      {
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
      }));
    return exercises;
  }

  handleDeleteTrainingPlan = () => {
    axios.delete(`/api/trainingPlans/${this.props.trainingPlanId}`)
      .then(() => {
        this.handleCloseDeleteModal();
        this.props.trainingPlanDeleted();
      })
      .catch(() => {
        this.handleCloseDeleteModal();
      });
  }

  handleCloseTrainingPlanModal = () => {
    this.setState({ showTrainingPlanModal: false });
  }

  handleShowTrainingPlanModal = () => {
    this.setState({ showTrainingPlanModal: true });
  }

  handleCloseDeleteModal = () => this.setState({ showDeleteModal: false });

  handleShowDeleteModal = () => this.setState({ showDeleteModal: true });

  // home page -> client modal
  setAttached = (boolValue) => this.setState({ attached: boolValue });

  setMouseHovered = (boolValue) => this.setState({ mouseHovered: boolValue });

  attachClientToTrainingPlan = () => {
    axios.post(`/api/clients/attached/${this.props.trainingPlanId}/${this.props.clientName}`)
      .then(() => {
        this.setAttached(true);
      })
      .catch(() => this.setState({ errorOccured: true }));
  };

  undoAttachClientToTrainingPlan = () => {
    axios.delete(`/api/clients/attached/${this.props.trainingPlanId}/${this.props.clientName}`)
      .then(() => {
        this.setAttached(false);
      })
      .catch(() => this.setState({ errorOccured: true }));
  };

  render() {
    let selectedExercises = [];
    if (this.state.showTrainingPlanModal) {
      selectedExercises = this.getExercises();
    }
    const {
      year, month, day, hour, minute,
    } = this.props.trainingDate;
    // dátum formázása
    const trainingDate = new Date(year, month, day, hour, minute, 0, 0).toLocaleDateString(
      navigator.language, { hour: '2-digit', minute: '2-digit' },
    );

    // az Image jsx elemnek van egy props objektuma, s azon belul egy src kulcs
    let cardImage = IMAGES.filter((image) => (image.key === this.props.selectedImage))[0].props.src;
    // ha nincs eltarolva, az alapertelmezett kep lesz a kartyan
    if (!cardImage) {
      cardImage = weightGreen;
    }

    const attachButton = (
      <Button className="Button" onClick={this.attachClientToTrainingPlan} style={{ float: 'left', marginTop: '7px' }}>
        {Translate(messages.attachId)}
      </Button>
    );

    const alreadyAttachedButton = (
      <Button
        variant={this.state.mouseHovered ? 'danger' : 'outline-success'}
        style={{ borderRadius: '8px', float: 'left', marginTop: '7px' }}
        onClick={this.undoAttachClientToTrainingPlan}
        onMouseOver={() => this.setMouseHovered(true)}
        onMouseLeave={() => this.setMouseHovered(false)}
      >
        {this.state.mouseHovered ? Translate(messages.undoId)
          : Translate(messages.attachedId)}
      </Button>
    );

    return (
      <Aux>
        <Card style={{ width: '300px' }}>
          <Card.Img
            src={cardImage}
            style={{
              // ne feszüljön rá teljesen a card-ra
              marginLeft: '7px', marginRight: '7px', marginTop: '7px', marginBottom: '7px', width: '95%',
            }}
          />
          <Card.Body>
            <Card.Title>{this.props.trainingPlanName}</Card.Title>
            <Card.Text>
              {Translate(messages.atId)}
              {' '}
              {trainingDate}
            </Card.Text>
            <Button
              className="SecondaryButton"
              onClick={this.handleShowTrainingPlanModal}
            >
              {Translate(messages.showExercisesId)}
            </Button>
            { this.props.showInModal && !this.state.attached && attachButton }
            { this.props.showInModal && this.state.attached && alreadyAttachedButton }
            { this.state.errorOccured && <BiError /> }
            {// csak az edzonek van joga modositasokat elvegezni
            this.props.isCoach && (
            <Link to={`/clients/attached/${this.props.trainingPlanId}`}>
              <Button
                className="SecondaryButton"
                style={{
                  marginTop: '5px', marginRight: '5px',
                }}
              >
                {Translate(messages.attachedClientsId)}
              </Button>
            </Link>
            )
            }

          </Card.Body>
          {this.props.isCoach && (
          <Card.Footer>
            <Aux>
              <Link to={`/trainingPlans/${this.props.trainingPlanId}`}>
                <Button
                  variant="outline-secondary"
                  style={{ marginRight: '5px', borderRadius: '8px' }}
                >
                  <IconContext.Provider
                    value={{
                      color: '#08457e',
                      className: 'global-class-name',
                      size: '25px',
                    }}
                  >
                    <AiFillEdit />
                  </IconContext.Provider>
                </Button>
              </Link>
              <Button
                variant="outline-secondary"
                style={{ borderRadius: '8px' }}
                onClick={this.handleShowDeleteModal}
              >
                <IconContext.Provider
                  value={{
                    color: '#bb3e03',
                    className: 'global-class-name',
                    size: '25px',
                  }}
                >
                  <BsFillTrashFill />
                </IconContext.Provider>
              </Button>
              {new Date() > new Date(year, month, day, hour, minute, 0, 0) && (
                <div style={{ float: 'right' }}>
                  <OverlayTrigger placement="left" overlay={<Tooltip id="tooltip-disabled">{Translate(messages.expiredTplanId)}</Tooltip>}>
                    <span className="d-inline-block right">
                      <Button variant="outline-secondary" style={{ pointerEvents: 'none', borderRadius: '8px' }}>
                        <FiAlertTriangle style={{
                          height: '25px', width: '25px', color: '#bb3e03',
                        }}
                        />
                      </Button>
                    </span>
                  </OverlayTrigger>
                </div>
              )}
            </Aux>
          </Card.Footer>
          )}
        </Card>
        <TrainingPlanModal
          selectedExercises={selectedExercises}
          showModal={this.state.showTrainingPlanModal}
          handleClose={this.handleCloseTrainingPlanModal}
        />
        <WarningModal
          show={this.state.showDeleteModal}
          handleClose={this.handleCloseDeleteModal}
          handleDeleteTrainingPlan={this.handleDeleteTrainingPlan}
        />
      </Aux>
    );
  }
}

export default TrainingPlanCard;
