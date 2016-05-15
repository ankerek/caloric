import Immutable from 'immutable'
import * as ActionTypes from '../actions'
import { D_NVS } from '../dictionary'
import { timestampFromObjectId } from '../utils/utils'

const InitialState = Immutable.Record({
  map: Immutable.Map(),
  loading: false
});
export const initialState = new InitialState;

const revive = ({ map, loading }) => initialState.merge({
  map: Immutable.fromJS(map),
  loading
});


const statistics = (state = initialState, action) => {
  if (!(state instanceof InitialState)) return revive(state);
  
  switch (action.type) {

    case ActionTypes.FETCH_MEALS_FOR_STATS_REQUEST:
    case ActionTypes.FETCH_PREFERENCES_FOR_STATS_REQUEST:
      return state.set('loading', true);
    case ActionTypes.FETCH_MEALS_FOR_STATS_FAILURE:
    case ActionTypes.FETCH_PREFERENCES_FOR_STATS_FAILURE:
      return state.set('loading', false);

    case ActionTypes.FETCH_PREFERENCES_FOR_STATS_SUCCESS:

      let nutritionValues = Immutable.Map();

      for(const property in D_NVS) {
        nutritionValues = nutritionValues.set(property, Immutable.fromJS({
          goals: action.result.reduce((previous, current) => {
            const value = current.nutritionValues.find((nv) => nv.type === property);
            previous[timestampFromObjectId(current._id)] = value ? value.goal : 0;

            return previous;
          }, {}),
          values: action.meals.reduce((previous, current) => {
            const timestamp = timestampFromObjectId(current._id);
            const value = current.nutritionValues[property] ? current.nutritionValues[property] : 0;
            previous[timestamp] = previous[timestamp] ? previous[timestamp] + value : value;

            return previous;
          }, {})
        }));
      }

      return state.merge({
        'map': nutritionValues,
        'loading': false
      }); 
    default:
      return state
  }
}

export default statistics