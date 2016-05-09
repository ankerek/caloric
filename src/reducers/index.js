import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import moment from 'moment'


import auth from './auth'
import meals from './meals'
import nutritionValues from './nutritionValues'
import notification from './notification'
import statistics from './statistics'

const routing = (state = {}, action) => {
  switch (action.type) {
    case 'ROUTE_LOCATION_DID_UPDATE': 
    	return action.payload
    default:
      return state
  }
}


// const InitialState = Immutable.Record({
//   map: Immutable.Map()
// });

// const initialState = new InitialState;
// const revive = ({ map }) => initialState.merge({
//   map: Immutable.fromJS(map)
// });
const preferences = (state = {}, action) => {
  //if (!(state instanceof InitialState)) return revive(state);
  switch (action.type) {
    case 'FETCH_PREFERENCES_SUCCESS': 
    case 'UPDATE_PREFERENCES_SUCCESS':

      let preferences = {...action.result};
      if(preferences.birthday) preferences.birthday = moment(preferences.birthday).format('D.M.YYYY');
      //if value is null -> problems with updating in redux-forms
      for(var property in preferences) { 
        if (preferences.hasOwnProperty(property)) {
          if(preferences[property] === null) preferences[property] = '';
        }
      }

      return preferences
    default:
      return state
  }
}



export default combineReducers({
  auth,
  meals,
  nutritionValues,
  preferences,
  statistics,
  notification,
  form: formReducer,
  routing
});