import Immutable from 'immutable'
import * as ActionTypes from '../actions'

const InitialState = Immutable.Record({
  user: Immutable.Map(),
  token: null
});
export const initialState = new InitialState;

const auth = (state = initialState, action) => {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {
    case ActionTypes.FETCH_USER_SUCCESS: 
      return Immutable.fromJS(action.result)
    case ActionTypes.SIGNIN_SUCCESS:
      return Immutable.fromJS(action.result)
   case ActionTypes.LOGOUT_SUCCESS:
   case ActionTypes.FETCH_USER_FAILURE:
      return state.clear()
    default:
      return state
  }
}

export default auth