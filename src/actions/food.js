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

export function resetFoodList() {
  return {
    type: ActionTypes.RESET_FOOD_LIST
  }
}

export function changeFoodListFilters(filters) {
  return {
    type: ActionTypes.CHANGE_FOOD_LIST_FILTERS,
    filters
  }
}


// export const updatePreferences = (data) => {

//   let today = new Date();
//   today.setUTCHours(0,0,0,0);

//   if(!data._id || today.getTime() !== timestampFromObjectId(data._id)) delete data._id; //jestlize to neni dnesni datum predvoleb (starsi), tak se smaze attribut _id a vytvori se novy dokument

//   return (dispatch, getState) => {
//     const token = getState().auth.get('token');

//     return dispatch({
//       types: [ActionTypes.UPDATE_PREFERENCES_REQUEST, ActionTypes.UPDATE_PREFERENCES_SUCCESS, ActionTypes.UPDATE_PREFERENCES_FAILURE],
//       promise: fetch('/api/preferences/'+(data._id ? data._id : ''), {
//         method: data._id ? 'PUT' : 'POST',
//         headers: {
//           'Authorization': 'Bearer ' + token,
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ data })
//       })
//     }).then(() => humane.log('Předvolby byly uloženy'));
//   }
// }
