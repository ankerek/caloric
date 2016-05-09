import React from 'react'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from '../utils/configureStore'
import routes from '../routes'

let initialState = window.__INITIAL_STATE__

const store = configureStore(initialState);

const App = () => {
	return (
		<Provider store={store}>
		  <Router history={browserHistory} children={routes(store)} />
		</Provider>
	)
} 

export default App