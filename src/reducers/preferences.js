import moment from 'moment'
import * as ActionTypes from '../actions'

export const initialState = {};

const preferences = (state = initialState, action) => {
  //if (!(state instanceof InitialState)) return revive(state);
  switch (action.type) {
    case ActionTypes.FETCH_PREFERENCES_SUCCESS: 
    case ActionTypes.UPDATE_PREFERENCES_SUCCESS:

      let preferences = {...action.result};
      if(preferences.birthday) preferences.birthday = moment(preferences.birthday).format('D.M.YYYY');
      //if value is null -> problems with updating in redux-forms
      for(var property in preferences) { 
        if (preferences.hasOwnProperty(property)) {
          if(preferences[property] === null) preferences[property] = '';
        }
      }

      return preferences
    case ActionTypes.FETCH_PREFERENCES_FAILURE: 
      return initialState;
    default:
      return state
  }
}

export default preferences