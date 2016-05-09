import Immutable from 'immutable'

import { FETCH_USER_SUCCESS, SIGNIN_SUCCESS, LOGOUT_SUCCESS } from '../actions/auth'

const InitialState = Immutable.Record({
  user: Immutable.Map(),
  token: null
});
const initialState = new InitialState;


const auth = (state = initialState, action) => {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  
  switch (action.type) {
    case FETCH_USER_SUCCESS: 
      return Immutable.fromJS(action.result)
    case SIGNIN_SUCCESS:
      return Immutable.fromJS(action.result)
   case LOGOUT_SUCCESS:
   case 'CHECK_AUTH_FAILURE':
      return state.clear()
    default:
      return state
  }
}

export default auth