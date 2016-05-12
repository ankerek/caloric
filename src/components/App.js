import React from 'react'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import configureRoutes from '../routes'




const App = ({store}) => {
	const routes = configureRoutes(store);
	return (
		<Provider store={store}>
		  <Router history={browserHistory} children={routes} />
		</Provider>
	)
} 

export default App