import Immutable from 'immutable'
import { ADD_MEAL_SUCCESS, UPDATE_MEAL_SUCCESS, UPDATE_MEAL_FOOD_SUCCESS, REMOVE_MEAL_FOOD_SUCCESS  } from '../actions/meals'

const InitialState = Immutable.Record({
  list: Immutable.List()
});
const initialState = new InitialState;

const revive = ({ list }) => initialState.merge({
  list: Immutable.fromJS(list)
});


const nutritionValues = (state = initialState, action) => {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {
    
    case ADD_MEAL_SUCCESS:
    case UPDATE_MEAL_SUCCESS:
    case UPDATE_MEAL_FOOD_SUCCESS:
    case REMOVE_MEAL_FOOD_SUCCESS: {

    	let meal = action.result;
      let meal_id = meal._id;

      return state.update('list', list => list.map((item) => {
        const newVal = meal.nutritionValues[item.get('type')];
        if(newVal > -1) {
          const oldVal = item.getIn(['meals', meal_id]);
          return item.setIn(['meals', meal_id], newVal).update('value', val => val + newVal - (oldVal ? oldVal : 0));
        }
        return item;
      }));
    }
    case 'FETCH_PREFERENCES_SUCCESS':

      if(action.meals) {
        var fromMeals = action.meals.reduce((previous, current) => {

          for(const property in current.nutritionValues) {
            const newVal = current.nutritionValues[property];

            if(previous[property]) {
              previous[property].value = previous[property].value + newVal;
              previous[property].meals[current._id] = newVal;
            } else {
              previous[property] = {
                value: newVal,
                meals: { [current._id]: newVal }
              }
            }

          }

          return previous;
        }, {});
      }


      if(action.result && action.result.nutritionValues) {
        const fromPreferences = action.result.nutritionValues.map((item) => {
          if(typeof fromMeals !== 'undefined' && fromMeals[item.type] && fromMeals[item.type].value) {
            item.value = fromMeals[item.type].value;
            item.meals = fromMeals[item.type].meals;
          } else item.value = 0;
          
          return item;
        });


        return state.set('list', Immutable.fromJS(fromPreferences));
      }

      return initialState;
    default:
      return state
  }
}

export default nutritionValues