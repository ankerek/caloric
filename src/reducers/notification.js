import Immutable from 'immutable'
import { CLOSE_NOTIFICATION } from '../actions/notification'

const InitialState = Immutable.Record({
  type: 'error',
  message: null
});

const initialState = new InitialState;

const notification = (state = initialState, action) => {
	if (!(state instanceof InitialState)) return initialState.merge(state);
  const { type, message } = action;

  if (type === 'ROUTE_LOCATION_DID_UPDATE' || type === CLOSE_NOTIFICATION) {
    return state.clear()
  } else if (message) {
    return state.set('message', message);
  }

  return state
}

export default notification