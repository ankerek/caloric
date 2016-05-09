import * as utils from '../utils/utils'
import 'isomorphic-fetch'


export const FETCH_MEALS_REQUEST = 'FETCH_MEALS_REQUEST'
export const FETCH_MEALS_SUCCESS = 'FETCH_MEALS_SUCCESS'
export const FETCH_MEALS_FAILURE = 'FETCH_MEALS_FAILURE'
export const fetchMeals = ({baseUrl, timestamp}) => {
  const timestamp2 = timestamp + 24*60*60*1000;
  const objectId = utils.objectIdFromTimestamp(timestamp);
  const objectId2 = utils.objectIdFromTimestamp(timestamp2);



  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [FETCH_MEALS_REQUEST, FETCH_MEALS_SUCCESS, FETCH_MEALS_FAILURE],
      promise: fetch(`${baseUrl}/api/meals?from=${objectId}&to=${objectId2}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    })
  }

}


export const ADD_MEAL_REQUEST = 'ADD_MEAL_REQUEST'
export const ADD_MEAL_SUCCESS = 'ADD_MEAL_SUCCESS'
export const ADD_MEAL_FAILURE = 'ADD_MEAL_FAILURE'
export const addMeal = (data) => {
  const hexSeconds = utils.hexSeconds(data.timestamp);

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [ADD_MEAL_REQUEST, ADD_MEAL_SUCCESS, ADD_MEAL_FAILURE],
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


export const UPDATE_MEAL_REQUEST = 'UPDATE_MEAL_REQUEST'
export const UPDATE_MEAL_SUCCESS = 'UPDATE_MEAL_SUCCESS'
export const UPDATE_MEAL_FAILURE = 'UPDATE_MEAL_FAILURE'
export const updateMeal = (data) => {

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [UPDATE_MEAL_REQUEST, UPDATE_MEAL_SUCCESS, UPDATE_MEAL_FAILURE],
      promise: fetch('/api/meals/'+data.meal_id, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({action: UPDATE_MEAL_REQUEST, meal: data.meal})
      })
    })
  }
  
}


export const UPDATE_MEAL_FOOD_REQUEST = 'UPDATE_MEAL_FOOD_REQUEST'
export const UPDATE_MEAL_FOOD_SUCCESS = 'UPDATE_MEAL_FOOD_SUCCESS'
export const UPDATE_MEAL_FOOD_FAILURE = 'UPDATE_MEAL_FOOD_FAILURE'
export const updateMealFood = (data) => {

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [UPDATE_MEAL_FOOD_REQUEST, UPDATE_MEAL_FOOD_SUCCESS, UPDATE_MEAL_FOOD_FAILURE],
      promise: fetch('/api/meals/'+data.meal_id, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({action: UPDATE_MEAL_FOOD_REQUEST, item: data.item})
      })
    })
  }
}


export const REMOVE_MEAL_FOOD_REQUEST = 'REMOVE_MEAL_FOOD_REQUEST'
export const REMOVE_MEAL_FOOD_SUCCESS = 'REMOVE_MEAL_FOOD_SUCCESS'
export const REMOVE_MEAL_FOOD_FAILURE = 'REMOVE_MEAL_FOOD_FAILURE'
export const removeMealFood = (data) => {

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [REMOVE_MEAL_FOOD_REQUEST, REMOVE_MEAL_FOOD_SUCCESS, REMOVE_MEAL_FOOD_FAILURE],
      promise: fetch('/api/meals/'+data.meal_id, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({action: REMOVE_MEAL_FOOD_REQUEST, item: data.item})
      }),
      item_id: data.item._id
    })
  }
  
}
