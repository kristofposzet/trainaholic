import * as actionTypes from '../actions/actionTypes';

const initialState = {
  error: null,
  loading: false,
  show: false,
  successful: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ERROR_FEEDBACK:
      return {
        ...state,
        error: action.error,
        loading: false,
        show: true,
        successful: false,
      };
    case actionTypes.START_LOADING:
      return {
        ...state,
        error: null,
        loading: true,
        successful: false,
      };
    case actionTypes.END_LOADING:
      return {
        ...state,
        error: null,
        loading: false,
      };
    case actionTypes.CLOSE_FEEDBACK:
      return {
        ...state,
        show: false,
        successful: false,
      };
    case actionTypes.SUCCESSFUL_FEEDBACK:
      return {
        ...state,
        show: true,
        successful: true,
      };
    default:
      return state;
  }
};

export default reducer;
