//import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import promiseMiddleware from './promiseMiddleware'
import rootReducer from '../reducers'

export default function configureStore(state = undefined) {

	const middlewares = [promiseMiddleware];
	
	const store = createStore(
		rootReducer,
		state,
	  applyMiddleware(...middlewares)
	);

	if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

	return store;
}

