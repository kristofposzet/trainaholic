import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Wrapper from './hoc/Wrapper/Wrapper';
import I18nProvider from './i18n/provider';
import { LOCALES } from './types/locales';
import * as actions from './store/actions/index';

class App extends Component {
    state = {
      locale: LOCALES.HUNGARIAN,
    };

    componentDidMount() {
      this.props.runIntrospect();
    }

  localeHandler = (countryCode) => {
    let selectedLocale = null;
    if (countryCode === 'GB') {
      selectedLocale = LOCALES.ENGLISH;
    } else {
      selectedLocale = LOCALES.HUNGARIAN;
    }
    this.setState({
      locale: selectedLocale,
    });
  };

  render() {
    return (
      <I18nProvider locale={this.state.locale}>
        <div>
          <Wrapper
            localeHandler={this.localeHandler}
            language={this.state.locale}
          />
        </div>
      </I18nProvider>
    );
  }
}

App.propTypes = {
  runIntrospect: PropTypes.func,
};

App.defaultProps = {
  runIntrospect: null,
};

const mapDispatchToProps = (dispatch) => ({
  runIntrospect: () => dispatch(actions.runIntrospect()),
});

export default withRouter(connect(null, mapDispatchToProps)(App));
