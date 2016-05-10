import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'

import auth from './auth'
import meals from './meals'
import nutritionValues from './nutritionValues'
import preferences from './preferences'
import notification from './notification'
import statistics from './statistics'

// const routing = (state = {}, action) => {
//   switch (action.type) {
//     case 'ROUTE_LOCATION_DID_UPDATE': 
//     	return action.payload
//     default:
//       return state
//   }
// }




export default combineReducers({
  auth,
  meals,
  nutritionValues,
  preferences,
  statistics,
  notification,
  form
});