import Immutable from 'immutable'
import * as ActionTypes from '../actions'


const InitialState = Immutable.Record({
  loading: false,
  filters: Immutable.List(),
  list: Immutable.List()
});

const initialState = new InitialState;

const revive = ({ loading, list }) => initialState.merge({
  list: Immutable.fromJS(list),
  filters: Immutable.fromJS(list),
  loading
});


const food = (state = initialState, action) => {
  if (!(state instanceof InitialState)) return revive(state);


  switch (action.type) {
    case ActionTypes.FETCH_FOOD_LIST_REQUEST:
      return state.set('loading', true);

    case ActionTypes.FETCH_FOOD_LIST_FAILURE:
      return state.set('loading', false);

    case ActionTypes.FETCH_FOOD_LIST_SUCCESS: 
      return state.merge({
        loading: false,
        list: Immutable.fromJS(action.result)
      });
    case ActionTypes.RESET_FOOD_LIST:
      return state.clear()
    case ActionTypes.CHANGE_FOOD_LIST_FILTERS:
      return state.set('filters', Immutable.fromJS(action.filters))
    default:
      return state
  }
}

export default food