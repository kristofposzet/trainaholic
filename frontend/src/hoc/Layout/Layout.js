/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Aux from '../Auxiliary/Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import GuestModal from '../../components/UI/Modal/GuestModal';
import Register from '../../containers/UserOperations/Register/Register';
import Login from '../../components/UserOperations/Auth/Login';
import { USER_ROLES } from '../../types/userRoles';

class Layout extends Component {
  render() {
    return (
      <Aux>
        <Toolbar
          localeHandler={this.props.localeHandler}
          showLoginAsClient={this.props.showLoginAsClient}
          showLoginAsCoach={this.props.showLoginAsCoach}
          showRegisterAsClient={this.props.showRegisterAsClient}
          showRegisterAsCoach={this.props.showRegisterAsCoach}
          showLoginAsAdmin={this.props.showLoginAsAdmin}
        />
        <GuestModal
          title={this.props.title}
          show={this.props.show}
          isAuthenticated={this.props.isAuthenticated}
          handleClose={this.props.handleClose}
        >
          {this.props.loginAsClient && <Login role={USER_ROLES.client} />}
          {this.props.loginAsCoach && <Login role={USER_ROLES.coach} />}
          {this.props.loginAsAdmin && <Login role={USER_ROLES.admin} />}
          {this.props.registerAsCoach && <Register role={USER_ROLES.coach} />}
          {this.props.registerAsClient && <Register role={USER_ROLES.client} />}
        </GuestModal>
        <main>
          {this.props.children}
        </main>
      </Aux>
    );
  }
}

export default Layout;
