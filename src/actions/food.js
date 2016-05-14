import 'isomorphic-fetch'
import * as ActionTypes from '.'
import { removeDiacritics } from '../utils/removeDiacritics'



export function fetchFoodList(name) {
  const newName = removeDiacritics(name.toLowerCase());
  return (dispatch) => {
    return dispatch({
      types: [ActionTypes.FETCH_FOOD_LIST_REQUEST, ActionTypes.FETCH_FOOD_LIST_SUCCESS, ActionTypes.FETCH_FOOD_LIST_FAILURE],
      promise: fetch('/api/food-list/' + newName)
    });
  }
}

export function clearFoodList() {
  return {
    type: ActionTypes.CLEAR_FOOD_LIST
  }
}

export function changeFoodListFilters(filters) {
  return {
    type: ActionTypes.CHANGE_FOOD_LIST_FILTERS,
    filters
  }
}

export function fetchFoodDetail({ baseUrl, id }) {

  return (dispatch) => {
    return dispatch({
      types: [ActionTypes.FETCH_FOOD_DETAIL_REQUEST, ActionTypes.FETCH_FOOD_DETAIL_SUCCESS, ActionTypes.FETCH_FOOD_DETAIL_FAILURE],
      promise: fetch(baseUrl + '/api/food/' + id)
    });
  }
}

export const updateFood = (data) => {

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [ActionTypes.UPDATE_FOOD_REQUEST, ActionTypes.UPDATE_FOOD_SUCCESS, ActionTypes.UPDATE_FOOD_FAILURE],
      promise: fetch('/api/food/'+(data._id ? data._id : ''), {
        method: data._id ? 'PUT' : 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      })
    });
  }
}

export function clearFoodDetail() {
  return {
    type: ActionTypes.CLEAR_FOOD_DETAIL
  }
}