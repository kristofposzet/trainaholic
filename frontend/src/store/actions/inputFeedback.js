import * as actionTypes from './actionTypes';

export const errorFeedback = (error) => ({
  type: actionTypes.ERROR_FEEDBACK,
  error,
});

export const startLoading = () => ({
  type: actionTypes.START_LOADING,
});

export const endLoading = () => ({
  type: actionTypes.END_LOADING,
});

export const closeFeedback = () => ({
  type: actionTypes.CLOSE_FEEDBACK,
});

export const successfulFeedback = () => ({
  type: actionTypes.SUCCESSFUL_FEEDBACK,
});
