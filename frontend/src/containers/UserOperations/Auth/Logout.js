import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../../../store/actions/index';

class Logout extends Component {
  componentDidMount() {
    this.props.onLogout(this.props.userName);
  }

  render() {
    return <Redirect to="/" />;
  }
}

const mapStateToProps = (state) => ({
  userName: state.auth.userName,
});

const mapDispatchToProps = (dispatch) => ({
  onLogout: (userName) => dispatch(actions.logout(userName)),
});

Logout.propTypes = {
  userName: PropTypes.string,
  onLogout: PropTypes.func,
};

Logout.defaultProps = {
  userName: null,
  onLogout: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
