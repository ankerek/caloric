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

    // case ADD_MEAL_SUCCESS: {
    //   let meal = action.result.data;

    //   return state.map((item) => {
    //     const newVal = meal.nutritionValues[item.get('type')];
    //     if(newVal > -1) {
    //       const oldVal = item.getIn(['meals', meal_id]);
    //       return item.setIn(['meals', meal_id], newVal).update('value', val => val - oldVal + newVal);
    //     }
    //     return item;
    //   });


    //   // for(const property in D_NUTRITION_VALUES) {
    //   //   if (meal.hasOwnProperty(property)) {
    //   //     let newVal = meal[property];
    //   //     if(state.has(property)) {
    //   //       state = state.setIn([property, meal._id], newVal);
    //   //       state = state.updateIn([property, 'sum', 'value'], oldVal => oldVal + newVal);
    //   //     }
          
    //   //     else state = state.set(property, Immutable.fromJS({
    //   //       [meal._id]: newVal,
    //   //       sum: { name: D_NUTRIENTS[property].label, value: newVal }
    //   //     }));
    //   //   }
    //   // }

    //   return state;
    // }
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

      // for(const property in D_NUTRITION_VALUES) {
      //   if (meal.hasOwnProperty(property)) {
      //   	let newVal = meal[property];
      //     let oldVal = state.getIn([property, meal_id]);
      //     state = state.setIn([property, meal_id], newVal);

      //     state = state.updateIn([property, 'sum', 'value'], val => val - oldVal + newVal);
      //   }
      // }

      // return state;
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

      // for(const property in D_NUTRITION_VALUES) {
      //   //from meals
      //   if(action.meals && action.meals.length)
      //   action.meals.forEach( (meal) => {
      //     const meal_id = meal._id;
      //     //D_NUTRIENTS.forEach( (nutrient, type) => {
      //       if (meal.hasOwnProperty(property)) {
      //         let newVal = meal[property];
      //         if(state.has(property)) {
      //           state = state.setIn([property, meal_id], newVal);
      //           state = state.updateIn([property, 'sum', 'value'], oldVal => oldVal + newVal);
      //         }
              
      //         else state = state.set(property, Immutable.fromJS({
      //           [meal_id]: newVal,
      //           sum: { name: D_NUTRITION_VALUES[property].label, value: newVal }
      //         }));
      //       }
      //     //})
      //   })

      //   // from preferences
      //   if(action.result.data)
      //   if (action.result.data.hasOwnProperty(property)) {
      //     let newVal = action.result.data[property];
      //     if(state.has(property)) {
      //       state = state.setIn([property, 'sum', 'goal'], newVal);
      //     }
      //     else state = state.set(property, Immutable.fromJS({
      //       sum: { name: D_NUTRITION_VALUES[property].label, value: 0, goal: newVal }
      //     }));
      //   }
      // }

      //return state
    default:
      return state
  }
}

export default nutritionValues