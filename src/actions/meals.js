import * as utils from '../utils/utils'
import 'isomorphic-fetch'
import * as ActionTypes from '.'



export const fetchMeals = ({baseUrl, timestamp}) => {
  const timestamp2 = timestamp + 24*60*60*1000;
  const objectId = utils.objectIdFromTimestamp(timestamp);
  const objectId2 = utils.objectIdFromTimestamp(timestamp2);



  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [ActionTypes.FETCH_MEALS_REQUEST, ActionTypes.FETCH_MEALS_SUCCESS, ActionTypes.FETCH_MEALS_FAILURE],
      promise: fetch(`${baseUrl}/api/meals?from=${objectId}&to=${objectId2}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    })
  }

}



export const addMeal = (data) => {
  const hexSeconds = utils.hexSeconds(data.timestamp);

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [ActionTypes.ADD_MEAL_REQUEST, ActionTypes.ADD_MEAL_SUCCESS, ActionTypes.ADD_MEAL_FAILURE],
      promise: fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({hexSeconds, meal: data.meal})
      })
    });
  };
}



export const updateMeal = (data) => {

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [ActionTypes.UPDATE_MEAL_REQUEST, ActionTypes.UPDATE_MEAL_SUCCESS, ActionTypes.UPDATE_MEAL_FAILURE],
      promise: fetch('/api/meals/'+data.meal_id, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({action: ActionTypes.UPDATE_MEAL_REQUEST, meal: data.meal})
      })
    })
  }
  
}



export const updateMealFood = (data) => {

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [ActionTypes.UPDATE_MEAL_FOOD_REQUEST, ActionTypes.UPDATE_MEAL_FOOD_SUCCESS, ActionTypes.UPDATE_MEAL_FOOD_FAILURE],
      promise: fetch('/api/meals/'+data.meal_id, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({action: ActionTypes.UPDATE_MEAL_FOOD_REQUEST, item: data.item})
      })
    })
  }
}



export const removeMealFood = (data) => {

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [ActionTypes.REMOVE_MEAL_FOOD_REQUEST, ActionTypes.REMOVE_MEAL_FOOD_SUCCESS, ActionTypes.REMOVE_MEAL_FOOD_FAILURE],
      promise: fetch('/api/meals/'+data.meal_id, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({action: ActionTypes.REMOVE_MEAL_FOOD_REQUEST, item: data.item})
      }),
      item_id: data.item._id
    })
  }
  
}
