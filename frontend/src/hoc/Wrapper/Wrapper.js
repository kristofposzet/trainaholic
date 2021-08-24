/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../Layout/Layout';
import Routes from '../../components/Routes/Routes';

const messages = {
  loginAsClientId: 'layout_loginAsClient',
  loginAsCoachId: 'layout_loginAsCoach',
  loginAsAdminId: 'layout_loginAsAdmin',
  registerAsClientId: 'layout_registerAsClient',
  registerAsCoachId: 'layout_registerAsCoach',
  nothingId: 'commonMessages_nothing',
};

// azert van szukseg a wrapper-re, mert a layout-ban es a / path-en is szuksegem van az
// esemneykezelokre, pl. mikor megnyilik vagy bezarul egy modal

class Wrapper extends Component {
  state = {
    showModal: false,
    loginAsClient: false,
    loginAsCoach: false,
    loginAsAdmin: false,
    registerAsCoach: false,
    registerAsClient: false,
    title: messages.nothingId,
  }

  componentDidUpdate(prevProps) {
    // ha megvaltozik az isAuthenticated prop, akkor uj oldal fog megjelenni a user elott
    // es nem fog megvalosulni a handleClose(), igy, miutan kijelentkezett a felhasznalo,
    // egybol a sign in modal jelenik meg elotte, mert nem lettek false-ra allitva az ertekek
    if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
      this.handleClose();
    }
  }

  handleShowLoginAsClient = () => {
    this.setState({
      showModal: true,
      loginAsClient: true,
      title: messages.loginAsClientId,
    });
  }

  handleShowLoginAsCoach = () => {
    this.setState({
      showModal: true,
      loginAsCoach: true,
      title: messages.loginAsCoachId,
    });
  }

  handleShowLoginAsAdmin = () => {
    this.setState({
      showModal: true,
      loginAsAdmin: true,
      title: messages.loginAsAdminId,
    });
  }

  handleShowRegisterAsCoach = () => {
    this.setState({
      showModal: true,
      registerAsCoach: true,
      title: messages.registerAsCoachId,
    });
  }

  handleShowRegisterAsClient = () => {
    this.setState({
      showModal: true,
      registerAsClient: true,
      title: messages.registerAsClientId,
    });
  }

  handleClose = () => {
    this.setState({
      showModal: false,
      loginAsClient: false,
      loginAsCoach: false,
      loginAsAdmin: false,
      registerAsClient: false,
      registerAsCoach: false,
      title: messages.nothingId,
    });
  }

  render() {
    return (
      <Layout
        localeHandler={this.props.localeHandler}
        handleShow={this.handleShow}
        showLoginAsClient={this.handleShowLoginAsClient}
        showLoginAsCoach={this.handleShowLoginAsCoach}
        showLoginAsAdmin={this.handleShowLoginAsAdmin}
        showRegisterAsClient={this.handleShowRegisterAsClient}
        showRegisterAsCoach={this.handleShowRegisterAsCoach}
        title={this.state.title}
        show={this.state.showModal}
        isAuthenticated={this.props.isAuthenticated}
        handleClose={this.handleClose}
        loginAsClient={this.state.loginAsClient}
        loginAsCoach={this.state.loginAsCoach}
        loginAsAdmin={this.state.loginAsAdmin}
        registerAsClient={this.state.registerAsClient}
        registerAsCoach={this.state.registerAsCoach}
      >
        <Routes
          language={this.props.language}
          showLoginAsClient={this.handleShowLoginAsClient}
          showLoginAsCoach={this.handleShowLoginAsCoach}
          showRegisterAsClient={this.handleShowRegisterAsClient}
          showRegisterAsCoach={this.handleShowRegisterAsCoach}
        />
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.userName,
});

export default connect(mapStateToProps)(Wrapper);
