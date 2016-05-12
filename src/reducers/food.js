import Immutable from 'immutable'
import * as ActionTypes from '../actions'


const InitialState = Immutable.Record({
  loading: false,
  filters: Immutable.List(),
  list: Immutable.List(),
  detail: Immutable.Map()
});

const initialState = new InitialState;

const revive = ({ loading, filters, list, detail }) => initialState.merge({
  loading,
  filters: Immutable.fromJS(filters),
  list: Immutable.fromJS(list),
  detail: Immutable.fromJS(detail)
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
    case ActionTypes.CLEAR_FOOD_LIST:
      return state.set('list', Immutable.List())
    case ActionTypes.CHANGE_FOOD_LIST_FILTERS:
      return state.set('filters', Immutable.fromJS(action.filters))


    case ActionTypes.FETCH_FOOD_DETAIL_SUCCESS:
    case ActionTypes.UPDATE_FOOD_SUCCESS:
      let fields = {...action.result};
      //if value is null -> problems with updating in redux-forms
      for(const property in fields) { 
        if (fields.hasOwnProperty(property)) {
          if(fields[property] === null) fields[property] = '';
          else if(property !== 'name' && property !== '_id' && property !== '_name') fields[property] = Math.round(fields[property] / 10000 * 100) / 100;
        }
      }

      return state.set('detail', Immutable.fromJS(fields))

    case ActionTypes.CLEAR_FOOD_DETAIL:
      return state.set('detail', Immutable.Map())

    default:
      return state
  }
}

export default food