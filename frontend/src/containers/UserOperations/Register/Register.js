import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../../components/Styles/UICheckFeedback.css';
import '../../../components/Styles/Button.css';

import RegisterForm from '../../../components/UserOperations/Register/Register';

class Register extends Component {
  state = { country: 'Romania', region: '' };

  selectCountry = (selectedCountry) => {
    this.setState({ country: selectedCountry });
  }

  selectRegion = (selectedRegion) => {
    this.setState({ region: selectedRegion });
  }

  render() {
    return (
      <RegisterForm
        country={this.state.country}
        region={this.state.region}
        onSelectCountry={this.selectCountry}
        onSelectRegion={this.selectRegion}
        role={this.props.role}
      />
    );
  }
}

Register.propTypes = {
  role: PropTypes.number,
};

Register.defaultProps = {
  role: null,
};

export default Register;
