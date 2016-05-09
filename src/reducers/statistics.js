import Immutable from 'immutable'
import * as ActionTypes from '../actions/statistics'
import { D_NUTRITION_VALUES } from '../dictionary'
import { timestampFromObjectId } from '../utils/utils'

const InitialState = Immutable.Record({
  map: Immutable.Map()
});
const initialState = new InitialState;

const revive = ({ map }) => initialState.merge({
  map: Immutable.fromJS(map),
});

/*
nutritionValues: {
  kcal: {
    values: {
      id1: 5,
      id2: 10
    },
    goals: {
      'id1': 10,
      'id2': 20
    }
  }
}
 */


const statistics = (state = initialState, action) => {
  if (!(state instanceof InitialState)) return revive(state);
  
  switch (action.type) {
    case ActionTypes.FETCH_PREFERENCES_FOR_STATS_SUCCESS:

      let nutritionValues = Immutable.Map();

      for(const property in D_NUTRITION_VALUES) {
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

      return state.set('map', nutritionValues); 
    default:
      return state
  }
}

export default statistics