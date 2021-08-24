import React from 'react';
// behuztam az index.js-ben a BrowserRouter-t, igy tudom hasznalni a Route-ot
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Slider from '../Slider/Slider';
import Logout from '../../containers/UserOperations/Auth/Logout';
import ExerciseTypesScrollMenu from '../../containers/NewExercise/ExerciseTypeScrollMenu/ExerciseTypesScrollMenu';
import TrainingPlans from '../../containers/TrainingPlans/TrainingPlans';
import CurrentTrainingPlans from '../../containers/TrainingPlans/CurrentTrainingPlans/CurrentTrainingPlans';
import EditTrainingPlan from '../TrainingPlans/EditTrainingPlan/EditTrainingPlan';
import InteractiveMap from '../../containers/InteractiveMap/InteractiveMap';
import UpdateProfile from '../UserOperations/UpdateProfile/UpdateProfile';
import AttachedClientsMapper from '../TrainingPlans/AttachedClients/AttachedClientsMapper';
import Profile from '../Profile/Profile';
import AdminPage from '../Admin/AdminPage';
import HomePage from '../HomePage/HomePage';
import NotFound from '../NotFound/NotFound';
import Chat from '../Chat/Chat';
import { USER_ROLES } from '../../types/userRoles';

const routes = (props) => {
  if (props.isAuthenticated) {
    if (props.role === USER_ROLES.coach) {
      return (
        <Switch>
          <Route path="/logout" component={Logout} />
          <Route path="/newExercise" render={() => (<ExerciseTypesScrollMenu language={props.language} />)} />
          <Route path="/trainingPlans/:id" component={EditTrainingPlan} />
          <Route path="/trainingPlans" render={() => (<CurrentTrainingPlans isCoach />)} />
          <Route path="/personsNearby" render={() => (<InteractiveMap isCoach />)} />
          <Route path="/newTrainingPlan">
            <TrainingPlans isNewTrainingPlan />
          </Route>
          <Route path="/clients/attached/:id" component={AttachedClientsMapper} />
          <Route path="/personalDataUpdate" component={UpdateProfile} />
          <Route path="/profile/:userName" component={Profile} />
          <Route path="/chat">
            <Chat userName={props.isAuthenticated} />
          </Route>
          <Route path="/" exact>
            <HomePage role={props.role} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      );
    } if (props.role === USER_ROLES.client) {
      return (
        <Switch>
          <Route path="/logout" component={Logout} />
          <Route path="/trainingPlans" render={() => (<CurrentTrainingPlans />)} />
          <Route path="/personsNearby" render={() => (<InteractiveMap />)} />
          <Route path="/personalDataUpdate" component={UpdateProfile} />
          <Route path="/profile/:userName" component={Profile} />
          <Route path="/chat">
            <Chat userName={props.isAuthenticated} />
          </Route>
          <Route path="/" exact>
            <HomePage role={props.role} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      );
    } if (props.role === USER_ROLES.admin) {
      return (
        <Switch>
          <Route path="/logout" component={Logout} />
          <Route path="/" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      );
    }
  }

  return (
    <Switch>
      <Route path="/" exact>
        {/* a ... operator atadja a Slidernek egesz props objektumot, mert szuksegem lesz
          a showLoginAsClient,showLoginAsCoach stb. fuggvenydeklaraciokra, amit ebbol a props-bol
          nyerek ki, pl. props.showLoginAsClient */}
        <Slider {...props} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
};

routes.propTypes = {
  isAuthenticated: PropTypes.string,
  language: PropTypes.string,
  role: PropTypes.number,
};

routes.defaultProps = {
  isAuthenticated: null,
  language: null,
  role: null,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.userName,
  role: state.auth.role,
});

export default connect(mapStateToProps)(routes);
