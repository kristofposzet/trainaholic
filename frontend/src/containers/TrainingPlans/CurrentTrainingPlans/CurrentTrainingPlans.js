import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { GiEmptyHourglass } from 'react-icons/gi';
import { IconContext } from 'react-icons';
import { Row, Col } from 'react-bootstrap';
import TrainingPlanNavigation from '../../../components/Navigation/TrainingPlans/TrainingPlanNavigation';
import FeedbackWrapper from '../../../components/UI/Feedback/FeedbackWrapper';
import Spinner from '../../../components/UI/Spinner/Spinner';
import TrainingPlansMapper from '../../../components/TrainingPlans/Mapper/TrainingPlansMapper';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import PaginationUI from '../../../components/UI/Pagination/Pagination';
import * as actions from '../../../store/actions/index';
import { VARIANT_TYPES } from '../../../types/variantTypes';
import Translate from '../../../i18n/translate';

const messages = {
  unsuccessfulLoadId: 'commonMessages_unsuccessfulLoadId',
  noTrainingPlanId: 'toolbar_noTrainingPlan',
};

const maxItemsPerPage = 10;

class CurrentTrainingPlans extends Component {
  state = {
    trainingPlans: [],
    currentPage: 1,
    allItems: 0,
    loaded: false,
  }

  componentDidMount() {
    this.props.onLoad();
    axios.get('/api/noOfCurrentTrainingPlans')
      .then((resp) => {
        // ha az oldalt frissitjuk, megkeresi, hogy adtunk-e meg lapszámot és, hogy
        // ez a szám int-e. Ha nem, az 1. oldalt tölti be
        // eslint-disable-next-line react/prop-types
        const thisPage = +queryString.parse(this.props.location.search).page;
        let currentPage = 1;
        if (!Number.isNaN(thisPage) && parseInt(thisPage, 10) === thisPage) {
          currentPage = thisPage;
        }
        this.getTrainingPlansForSpecifiedPage(currentPage);
        this.setState({
          allItems: resp.data,
          loaded: true,
        });
      })
      .catch((err) => {
        this.props.onError(err);
        this.props.onCloseFeedback();
      });
  }

  getTrainingPlansForSpecifiedPage = (pageNo) => {
    axios.get('/api/trainingPlans', { params: { page: pageNo } })
      .then((res) => {
        this.props.onSuccess();
        this.props.endLoad();
        this.props.onCloseFeedback();
        this.setState({
          trainingPlans: res.data,
          currentPage: pageNo,
        });
      })
      .catch((err) => {
        this.props.onError(err);
        this.props.onCloseFeedback();
      });
  }

  // ha kitorlodott egy edzesterv, ez a fuggveny lesz triggerelve es rerendert eredmenyez
  trainingPlanDeleted = () => {
    this.getTrainingPlansForSpecifiedPage(this.state.currentPage);
  }

  render() {
    let noOfItems = this.state.allItems / maxItemsPerPage;
    if (!Number.isInteger(noOfItems)) {
      // ha pl. 11/10 az ertek, akkor 2 oldalam lesz, az egyik oldalon 10 elem, a masikon 1
      noOfItems = Math.floor(noOfItems) + 1;
    }
    return (
      <div style={{ marginTop: '28px', margin: '30px' }}>
        {this.props.isCoach && <TrainingPlanNavigation />}
        <div style={{ marginTop: '28px' }}>
          {this.props.error
            ? (
              <FeedbackWrapper
                variant={VARIANT_TYPES.danger}
                messageId={messages.unsuccessfulLoadId}
                showFeedback={this.props.showFeedback}
              />
            ) : null}
          {this.props.loading ? (
            <Spinner />
          ) : (
            <Aux>
              <TrainingPlansMapper
                trainingPlans={this.state.trainingPlans}
                pageNumber={this.state.currentPage}
                trainingPlanDeleted={this.trainingPlanDeleted}
                isCoach={this.props.isCoach}
              />
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {this.state.allItems > 10 && (
                <PaginationUI
                  noOfItems={noOfItems}
                  baseURL="/trainingPlans?"
                  getTrainingPlans={this.getTrainingPlansForSpecifiedPage}
                  currentPage={+this.state.currentPage}
                />
                )}
                { // ha az oldal mar betoltodott es nincs edzesterv
                this.state.allItems === 0 && this.state.loaded && (
                  <Row style={{ marginTop: '300px' }}>
                    <Col lg={{ span: 3 }}>
                      <IconContext.Provider
                        value={{
                          color: '#08457e',
                          className: 'global-class-name',
                          size: '55px',
                        }}
                      >
                        <GiEmptyHourglass />
                      </IconContext.Provider>
                    </Col>
                    <Col lg={{ span: 9 }}>
                      <h5>
                        {Translate(messages.noTrainingPlanId)}
                      </h5>
                    </Col>
                  </Row>
                )
                }
              </div>
            </Aux>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userName: state.auth.userName,
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

CurrentTrainingPlans.propTypes = {
  isCoach: PropTypes.bool,
  onLoad: PropTypes.func,
  endLoad: PropTypes.func,
  onCloseFeedback: PropTypes.func,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
  error: PropTypes.instanceOf(Object),
  showFeedback: PropTypes.bool,
  loading: PropTypes.bool,
};

CurrentTrainingPlans.defaultProps = {
  isCoach: null,
  onLoad: null,
  endLoad: null,
  onCloseFeedback: null,
  onError: null,
  onSuccess: null,
  error: null,
  showFeedback: null,
  loading: null,
};

// ha withRouter-be ágyazom ezt a komponenst, speciális props-okhoz férek hozzá, jelen esetben
// a this.props.location.search-hoz, ahol ki tudom nyerni a query stringet. Ezt a query stringet
// a pagination-nél history.push()-sal tettem be, ahhoz, hogy azt a props-ot is el tudjuk érni,
// a pagination komponenst is be kellett ágyazni a withRouter-be
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CurrentTrainingPlans));
