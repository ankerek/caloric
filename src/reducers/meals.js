import Immutable from 'immutable'
import * as ActionTypes from '../actions'

const InitialState = Immutable.Record({
  loading: false,
  meals: Immutable.List()
});

export const initialState = new InitialState;

const revive = ({ loading, meals }) => initialState.merge({
  meals: Immutable.fromJS(meals),
  loading
});


const meals = (state = initialState, action) => {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {
    case ActionTypes.FETCH_MEALS_REQUEST:
    case ActionTypes.ADD_MEAL_REQUEST:
    case ActionTypes.UPDATE_MEAL_REQUEST:
    case ActionTypes.UPDATE_MEAL_FOOD_REQUEST:
    case ActionTypes.REMOVE_MEAL_FOOD_REQUEST:
      return state.set('loading', true);

    case ActionTypes.FETCH_MEALS_SUCCESS: 
      return state.merge({
        loading: false,
        meals: Immutable.fromJS(action.result)
      });
    case ActionTypes.ADD_MEAL_SUCCESS:
      return state.update('meals', list => list.push(Immutable.fromJS(action.result))).set('loading', false)
    case ActionTypes.UPDATE_MEAL_SUCCESS:
    case ActionTypes.UPDATE_MEAL_FOOD_SUCCESS:
      return state.update('meals', list => list.mergeDeepIn([list.findIndex((meal) => meal.get('_id') === action.result._id)], action.result)).set('loading', false)
    case ActionTypes.REMOVE_MEAL_FOOD_SUCCESS:
      const index = state.get('meals').findIndex((meal) => meal.get('_id') === action.result._id);
      return state
        .update('meals', list => list.mergeDeepIn([index], action.result)
          .updateIn([index, 'items'], list => list.deleteIn([list.findIndex((item) => item.get('_id') === action.item_id)]))
        ).set('loading', false);

    case ActionTypes.FETCH_MEALS_FAILURE:
    case ActionTypes.ADD_MEAL_FAILURE:
    case ActionTypes.PDATE_MEAL_FAILURE:
    case ActionTypes.UPDATE_MEAL_FOOD_FAILURE:
    case ActionTypes.REMOVE_MEAL_FOOD_FAILURE:
      return state.set('loading', false);

    default:
      return state
  }
}

export default meals