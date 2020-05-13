import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import axios from 'axios';
import { connect } from 'react-redux';
import { setMovies, setUser, setProfile } from '/actions/actions';

import MainView from './components/main-view/main-view';
import moviesApp from './reducers/reducers';

import './index.scss';

const store = createStore(
  moviesApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

//main component
class MyFlixApplication extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainView />
      </Provider>
    );
  }
}

// find the root of the app
const container = document.getElementsByClassName('app-container')[0];

//render the app inside the root
ReactDOM.render(React.createElement(MyFlixApplication), container)