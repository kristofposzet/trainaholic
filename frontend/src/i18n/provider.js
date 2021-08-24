import React, { Fragment } from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import { LOCALES } from '../types/locales';
import { HUNGARIAN_MESSAGES } from './messages/hu';
import { ENGLISH_MESSAGES } from './messages/en';

const provider = (props) => (
  <IntlProvider
    locale={props.locale}
    textComponent={Fragment}
    messages={props.locale === LOCALES.HUNGARIAN ? HUNGARIAN_MESSAGES : ENGLISH_MESSAGES}
  >
    {props.children}
  </IntlProvider>
);

provider.propTypes = {
  locale: PropTypes.string,
};

provider.defaultProps = {
  locale: LOCALES.HUNGARIAN,
};

export default provider;
