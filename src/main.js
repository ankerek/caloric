import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import configureStore from './utils/configureStore'
import App from './components/App'

//import Perf from 'react-addons-perf'


//window.Perf = Perf;

if ( process.env.BROWSER ) {
  require('./theme/styles/main.scss');
}

const rootEl = document.getElementById('main');

const initialState = window.__INITIAL_STATE__

//creating redux store
const store = configureStore(initialState);

ReactDOM.render(
	<AppContainer>
  	<App store={store} />
  </AppContainer>,
  rootEl
);

// for hot reloading
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

