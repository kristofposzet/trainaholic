import React from 'react';
import { Link } from 'react-router-dom';
import Translate from '../../i18n/translate';

const notFound = () => (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
    <h3>404 - Not found</h3>
    <Link to="/">
      {Translate('homepage_goHome')}
    </Link>
  </div>
);

export default notFound;
