//import {Iterable} from 'immutable'
//import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import promiseMiddleware from './promiseMiddleware'
import rootReducer from '../reducers'

export default function configureStore(state = undefined) {



	let middlewares = [promiseMiddleware];

	if(process.env.NODE_ENV === 'development') {

		// let createLogger = require('redux-logger');

		// const stateTransformer = (state) => {
		//   if (Iterable.isIterable(state.meals)) return state.meals.toJS();
		//   else return state;
		// };

		// const loggerMiddleware = createLogger({
		//   stateTransformer
		// });

		//middlewares.push(loggerMiddleware);
		

	}
	
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

