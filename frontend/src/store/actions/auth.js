import axios from 'axios';
import * as actionTypes from './actionTypes';
import { errorFeedback } from './inputFeedback';

export const authStart = () => ({
  type: actionTypes.AUTH_START,
});

export const authSucces = (userData) => ({
  type: actionTypes.AUTH_SUCCES,
  role: userData.role,
  user: userData.user,
});

export const authFail = (error) => ({
  type: actionTypes.AUTH_FAIL,
  error,
});

export const authLogout = () => ({
  type: actionTypes.AUTH_LOGOUT,
});

// olyan, mint: return (dispatch) => { const authData = { userName } }
export const logout = (userName) => (dispatch) => {
  const authData = {
    userName,
  };

  axios.post('/api/logout', authData, {
    withCredentials: true,
  })
    .then(() => {
      dispatch(authLogout());
    })
    .catch((err) => {
      dispatch(authFail(err));
    });
};

export const auth = (userName, password, role) => (dispatch) => {
  dispatch(authStart());
  const authData = {
    userName,
    password,
    role,
  };

  axios.post('/api/login', authData, {
    withCredentials: true,
  })
    .then((resp) => {
      dispatch(authSucces(resp.data));
    })
    .catch((err) => {
      dispatch(authFail(err));
      dispatch(errorFeedback(err));
    });
};

export const runIntrospect = () => (dispatch) => {
  axios.get('/api/introspect', { withCredentials: true })
    .then((resp) => {
      dispatch(authSucces(resp.data));
    })
  // a jwt lejart, tehat be kell jelentkezni, mert 401-et dob vissza
    .catch(() => { });
};
