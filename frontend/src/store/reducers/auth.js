import * as actionTypes from '../actions/actionTypes';

const initialState = {
  userName: null,
  error: null,
  loading: false,
  role: null,
};

// az 1. argumentum a regi state, a masodik az action
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      // a fuggveny vissza kell teritse az update-elt state-et
      return {
        // le kell masoljam a state osszes elemet, hogy ne vesszenek el,
        // s utana modositom a parameterkent megadottakat
        ...state,
        error: null,
        loading: true,
      };
    case actionTypes.AUTH_SUCCES:
      return {
        ...state,
        userName: action.user,
        role: action.role,
        error: null,
        loading: false,
      };
    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        userName: null,
        role: null,
      };
    default:
      return state;
  }
};

export default reducer;
