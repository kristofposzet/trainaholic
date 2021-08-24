import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import * as actions from '../../store/actions/index';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Spinner from '../UI/Spinner/Spinner';
import FeedbackWrapper from '../UI/Feedback/FeedbackWrapper';
import { VARIANT_TYPES } from '../../types/variantTypes';
import UserProfileCard from './UserProfileCard';
import PaginationUI from '../UI/Pagination/Pagination';

const messages = {
  unsuccessfulLoadId: 'commonMessages_unsuccessfulLoadId',
};

const maxItemsPerPage = 10;

const adminPage = (props) => {
  const [users, setAllUsers] = useState([]);
  const [noOfItems, setNoOfItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const findUsers = (pageNumber) => {
    props.onLoad();
    axios.get('/api/users', { params: { page: pageNumber } })
      .then((resp) => {
        setAllUsers(resp.data.users);
        props.onSuccess();
        props.endLoad();
        props.onCloseFeedback();
      })
      .catch((err) => {
        props.onError(err);
        props.onCloseFeedback();
      });
  };

  // ha a pagination megváltoztatja az aktuális oldalt, meghívódik ez a useEffect()
  useEffect(() => {
    const thisPage = +queryString.parse(props.location.search).page;
    if (!Number.isNaN(thisPage) && parseInt(thisPage, 10) === thisPage) {
      findUsers(thisPage);
    }
  }, [currentPage]);

  // legeloszor hivodik meg, lekerjuk az osszes felhasznalo szamat
  useEffect(() => {
    const thisPage = +queryString.parse(props.location.search).page;
    if (!Number.isNaN(thisPage) && parseInt(thisPage, 10) === thisPage) {
      setCurrentPage(thisPage);
    } else {
      // ha nincs query string megadva, a fooldalon meghivjuk a kerest
      findUsers(1);
    }
    axios.get('/api/users/count')
      .then((resp) => {
        const allItems = resp.data.noOfAllUsers;
        if (!Number.isInteger(allItems / maxItemsPerPage)) {
          setNoOfItems(Math.floor(allItems / maxItemsPerPage) + 1);
        } else {
          setNoOfItems(allItems / maxItemsPerPage);
        }
      })
      .catch((err) => {
        props.onError(err);
        props.onCloseFeedback();
      });
  }, []);

  return (
    <Aux>
      {props.error
        ? (
          <FeedbackWrapper
            variant={VARIANT_TYPES.danger}
            messageId={messages.unsuccessfulLoadId}
            showFeedback={props.showFeedback}
          />
        ) : null}
      {props.loading ? (
        <Spinner />
      ) : (
        <div style={{ marginTop: '28px', margin: '30px' }}>
          <Row lg={6} md={3} xs={2}>
            {users.length > 0 && users.map((user, index) => (
              <div key={`${user.userName} - ${index + 1}`} style={{ marginRight: '45px', marginBottom: '25px' }}>
                <UserProfileCard user={user} handleDelete={() => findUsers(currentPage)} />
              </div>
            ))}
          </Row>
          <Row className="justify-content-md-center">
            <PaginationUI
              noOfItems={noOfItems}
              baseURL="/?"
              getTrainingPlans={setCurrentPage}
              currentPage={+currentPage}
            />
          </Row>
        </div>
      )}
    </Aux>

  );
};

const mapStateToProps = (state) => ({
  loading: state.inputFeedback.loading,
  error: state.inputFeedback.error,
  showFeedback: state.inputFeedback.show,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(adminPage));
