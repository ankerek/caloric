import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import configureStore from './utils/configureStore'

import Perf from 'react-addons-perf'
import App from './components/App'


window.Perf = Perf;

if ( process.env.BROWSER ) {
  require('./styles/main.scss');
}

const rootEl = document.getElementById('main');



const initialState = window.__INITIAL_STATE__

const store = configureStore(initialState);

ReactDOM.render(
	<AppContainer>
  	<App store={store} />
  </AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    ReactDOM.render(
      <AppContainer>
         <NextApp store={store} />
      </AppContainer>,
      rootEl
    );
  });
}

