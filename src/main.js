import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
//import { AppContainer } from 'react-hot-loader'
import Perf from 'react-addons-perf'
import App from './components/App'


window.Perf = Perf;

if ( process.env.BROWSER ) {
  require('./styles/main.scss');
}

const rootEl = document.getElementById('main');

ReactDOM.render(
  <App />,
  rootEl
);

// if (module.hot) {
//   module.hot.accept('./components/App', () => {
//     // If you use Webpack 2 in ES modules mode, you can
//     // use <App /> here rather than require() a <NextApp />.
//     const NextApp = require('./components/App').default;
//     ReactDOM.render(
//       <AppContainer>
//          <NextApp />
//       </AppContainer>,
//       rootEl
//     );
//   });
// }

