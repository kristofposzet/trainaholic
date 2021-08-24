import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../../store/actions/index';
import TrainingPlanComponents from '../../components/TrainingPlans/TrainingPlanComponents';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import AdditionalInformationsModal from '../../components/UI/Modal/AdditionalInformationsModal';

class TrainingPlans extends Component {
  state = {
    selectedExercises: [],
    exercises: [], // osszes exercise az adatbazisbol
    sets: 1,
    repetitions: 1,
    weight: 0,
    selectedExercise: { value: null, label: null },
    showModal: false,
    exerciseForEdit: {
      sets: 0, reps: 0, weight: 0, index: 0,
    },
    trainingPlanId: '',
    trainingPlanName: '',
    trainingDate: null,
    showAdditionalInfosModal: false,
    selectedImage: '',
  };

  componentDidMount() {
    this.props.onLoad();
    axios.get('/api/exercises')
      .then((resp) => {
        // ha egy meglevo edzestervet akarunk szerkeszteni, lekerjuk a hozzatartozo gyakorlatokat
        if (this.props.trainingPlanId) {
          axios.get(`/api/trainingPlans/${this.props.trainingPlanId}`)
            .then((respExistingTrainingPlan) => {
              const {
                exercises, id, trainingDate, trainingPlanName, selectedImage,
              } = respExistingTrainingPlan.data;
              const {
                year, month, day, hour, minute,
              } = trainingDate;
              // dátum formázása
              this.setState({
                selectedExercises: this.getExercises(exercises),
                trainingPlanId: id,
                trainingDate: new Date(year, month, day, hour, minute, 0, 0),
                trainingPlanName,
                selectedImage,
              });
            })
            .catch((err) => {
              // ha olyan id-jú edzéstervhez akar hozzáférni, ami nem az övé, akkor catch-be lép
              this.props.onError(err);
              this.props.onCloseFeedback();
            });
          return resp;
        }
        return resp;
      })
      .then((resp) => {
        this.props.endLoad();
        this.props.onCloseFeedback();
        const exercises = resp.data;
        this.setState({ exercises });
      })
      .catch((err) => {
        this.props.onError(err);
        this.props.onCloseFeedback();
      });
  }

  getExercises = (exercisesObject) => {
    // egy nagy objektumot kapunk vissza, ezt vegigjarjuk es helyette egy listat teritunk vissza
    const exercises = Object.entries(exercisesObject).map(([, exercise]) => (
      {
        id: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
      }));
    return exercises;
  }

  handleRemove = (rowIndex) => {
    const exercises = [...this.state.selectedExercises];
    exercises.splice(rowIndex - 1, 1);
    this.setState({
      selectedExercises: exercises,
    });
  }

  handleEdit = (rowIndex) => {
    const exercises = [...this.state.selectedExercises];
    const exerciseForEdit = { ...exercises[rowIndex - 1] };
    exerciseForEdit.index = rowIndex - 1;

    this.setState({
      exerciseForEdit: { ...exerciseForEdit },
    });
    this.handleShowModal();
  }

  handleSetsRangeSlider = (sets) => {
    this.setState({ sets });
  }

  handleRepsRangeSlider = (repetitions) => {
    this.setState({ repetitions });
  }

  handleWeightChange = (weight) => {
    this.setState({ weight });
  }

  handleChangesFromEdit = (changedExercise) => {
    const selectedExercises = [...this.state.selectedExercises];
    const { index } = changedExercise;
    const exercise = { ...selectedExercises[index] };
    exercise.reps = changedExercise.reps;
    exercise.sets = changedExercise.sets;
    exercise.weight = changedExercise.weight;
    selectedExercises[index] = exercise;

    this.setState({
      selectedExercises,
      exerciseForEdit: {
        sets: 0, reps: 0, weight: 0, index: 0,
      },
    });
    this.handleCloseModal();
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  handleShowModal = () => {
    this.setState({ showModal: true });
  }

  handleCloseAdditionalInfosModal = () => {
    this.setState({ showAdditionalInfosModal: false });
  }

  handleShowAdditionalInfosModal = () => {
    this.setState({ showAdditionalInfosModal: true });
  }

  handleAdd = () => {
    const exercise = this.state.selectedExercise;
    const { sets } = this.state;
    const { weight } = this.state;
    const reps = this.state.repetitions;
    const newExercise = {
      exerciseName: exercise.label,
      sets,
      reps,
      weight,
      id: exercise.value,
    };
    this.setState((prevState) => ({
      selectedExercises: [...prevState.selectedExercises, newExercise],
    }));
    this.setState({
      sets: 1,
      repetitions: 1,
      weight: 0,
      selectedExercise: { value: null, label: null },
    });
  }

  handleSelectedExercise = (e) => {
    this.setState((prevState) => {
      const selectedExercise = { ...prevState.selectedExercise };
      selectedExercise.label = e.label;
      selectedExercise.value = e.value;
      return { selectedExercise };
    });
  }

  handleSaveTrainingPlan = (trainingDate, trainingPlanName, selectedImage, redirectToClients) => {
    const newTrainingDate = {
      year: trainingDate.getFullYear(),
      month: trainingDate.getMonth(),
      day: trainingDate.getDate(),
      hour: trainingDate.getHours(),
      minute: trainingDate.getMinutes(),
    };
    const exercises = [...this.state.selectedExercises];
    const data = {
      exercises,
      userName: this.props.userName,
      trainingDate: newTrainingDate,
      trainingPlanName,
      selectedImage,
    };

    this.props.onLoad();
    if (this.props.isNewTrainingPlan) {
      axios.post('/api/trainingPlans', data)
        .then((resp) => {
          this.props.onSuccess();
          this.props.endLoad();
          this.props.onCloseFeedback();
          // itt nem tartom meg a kivalasztott gyakorlatokat, hanem csak akkor,
          // ha meglevo edzestervet modositok
          this.setState({ selectedExercises: [] });
          if (redirectToClients) {
            // a post válaszként visszaadja a beszúrt edzésterv kulcsát
            this.props.history.push(`/clients/attached/${resp.data}`);
          }
        })
        .catch((err) => {
          this.props.onError(err);
          this.props.onCloseFeedback();
        });
    } else {
      // put - megadott id-ju edzesterv osszes gyakorlatat kicserelem az ujakra
      // patch-re nem mukodne az update, mert backenden az update muvelet megtartana a
      // letezo kulcsokat, a replace viszont csak az uj adattal dolgozik
      axios.put(`/api/trainingPlans/${this.state.trainingPlanId}`, data)
        .then(() => {
          this.props.onSuccess();
          this.props.endLoad();
          this.props.onCloseFeedback();
          if (redirectToClients) {
            this.props.history.push(`/clients/attached/${this.state.trainingPlanId}`);
          }
        })
        .catch((err) => {
          this.props.onError(err);
          this.props.onCloseFeedback();
        });
    }
    this.setState({
      sets: 1,
      repetitions: 1,
      weight: 0,
      selectedExercise: { value: null, label: null },
    });
    this.handleCloseAdditionalInfosModal();
  }

  handleSubmit = () => {
    this.handleShowAdditionalInfosModal();
  }

  render() {
    const handlers = {
      handleSubmit: this.handleSubmit,
      handleSelectedExercise: this.handleSelectedExercise,
      handleAdd: this.handleAdd,
      handleShowModal: this.handleShowModal,
      handleCloseModal: this.handleCloseModal,
      handleChangesFromEdit: this.handleChangesFromEdit,
      handleRepsRangeSlider: this.handleRepsRangeSlider,
      handleSetsRangeSlider: this.handleSetsRangeSlider,
      handleWeightChange: this.handleWeightChange,
      handleEdit: this.handleEdit,
      handleRemove: this.handleRemove,
    };
    return (
      <Aux>
        <TrainingPlanComponents
          {...this.props}
          selectedExercises={this.state.selectedExercises}
          exercises={this.state.exercises}
          sets={this.state.sets}
          repetitions={this.state.repetitions}
          weight={this.state.weight}
          selectedExercise={this.state.selectedExercise}
          showModal={this.state.showModal}
          exerciseForEdit={this.state.exerciseForEdit}
          handlers={handlers}
          isNewTrainingPlan={this.props.isNewTrainingPlan}
        />
        <AdditionalInformationsModal
          show={this.state.showAdditionalInfosModal}
          handleClose={this.handleCloseAdditionalInfosModal}
          handleSaveTrainingPlan={this.handleSaveTrainingPlan}
          isNewTrainingPlan={this.props.isNewTrainingPlan}
          trainingDate={this.state.trainingDate}
          trainingPlanName={this.state.trainingPlanName}
          selectedImage={this.state.selectedImage}
        />
      </Aux>
    );
  }
}

TrainingPlans.propTypes = {
  userName: PropTypes.string,
  onLoad: PropTypes.func,
  endLoad: PropTypes.func,
  onCloseFeedback: PropTypes.func,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
  error: PropTypes.instanceOf(Object),
  showFeedback: PropTypes.bool,
  successful: PropTypes.bool,
  loading: PropTypes.bool,
  isNewTrainingPlan: PropTypes.bool,
  trainingPlanId: PropTypes.string,
  history: PropTypes.instanceOf(Object),
};

TrainingPlans.defaultProps = {
  userName: null,
  onLoad: null,
  endLoad: null,
  onCloseFeedback: null,
  onError: null,
  onSuccess: null,
  error: null,
  showFeedback: null,
  successful: null,
  loading: false,
  isNewTrainingPlan: false,
  trainingPlanId: null,
  history: null,
};

// ez egy fuggveny, amely a redux-ban tarolt state-et varja inputkent es
// state darabkákat tudunk kivenni és átalakítani props-szá, h felhasználhassuk öket itt
const mapStateToProps = (state) => ({
  userName: state.auth.userName,
  loading: state.inputFeedback.loading,
  error: state.inputFeedback.error,
  showFeedback: state.inputFeedback.show,
  successful: state.inputFeedback.successful,
});

// dispatch - ugy viselkedni, mint egy diszpecser
// megmondjuk, hogy milyen actiont akarunk dispatch-elni
// a mapDispToProps kap egy fuggvenyt input-ként
const mapDispatchToProps = (dispatch) => ({
  // onLoad props: egy referencia egy fuggvenyre, amely vegre lesz hajtva, hogy egy action-t
  // dispatch-eljen;
  // az arrow jobb oldalan levo fg. vissza lesz teritve, igy elerheto lesz az onLoad prop szamara
  onLoad: () => dispatch(actions.startLoading()),
  endLoad: () => dispatch(actions.endLoading()),
  onError: (err) => dispatch(actions.errorFeedback(err)),
  onCloseFeedback: () => setTimeout(() => {
    dispatch(actions.closeFeedback());
  }, 3000),
  onSuccess: () => dispatch(actions.successfulFeedback()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TrainingPlans));
