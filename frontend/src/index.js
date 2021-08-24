import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import {
  createStore, applyMiddleware, compose, combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import reportWebVitals from './reportWebVitals';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import authReducer from './store/reducers/auth';
import inputFeedbackReducer from './store/reducers/inputFeedback';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// thunk middleware
const rootReducer = combineReducers({
  auth: authReducer,
  inputFeedback: inputFeedbackReducer,
});

// a createStore() egy uj redux store-t hoz letre, ahol state-eket tarolunk
// a store inicializalva kell legyen reducer-rel (rootReducer), mert ezek a reducerek
// fogjak majd update-elni a state-et
const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk),
));

// ahhoz, hogy a store-t a react-hez tudjuk kotni, szuksegunk van provider-re
ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
