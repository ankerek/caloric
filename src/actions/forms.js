import { objectIdFromTimestamp, timestampFromObjectId } from '../utils/utils'
import 'isomorphic-fetch'
if ( process.env.BROWSER ) var humane = require('../utils/utils').humane;

export const FETCH_PREFERENCES_REQUEST = 'FETCH_PREFERENCES_REQUEST'
export const FETCH_PREFERENCES_SUCCESS = 'FETCH_PREFERENCES_SUCCESS'
export const FETCH_PREFERENCES_FAILURE = 'FETCH_PREFERENCES_FAILURE'
export function fetchPreferences({baseUrl, timestamp, meals}) {
  const timestamp2 = timestamp + 24*60*60*1000;

  const objectId = objectIdFromTimestamp(timestamp2);

  return (dispatch, getState) => {
    const token = getState().auth.get('token');


    return dispatch({
      types: [FETCH_PREFERENCES_REQUEST, FETCH_PREFERENCES_SUCCESS, FETCH_PREFERENCES_FAILURE],
      promise: fetch(baseUrl+'/api/preferences/' + objectId, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }),
      meals
    });
  }

}


/*
function fetchPreferencesSuccess(data) {
  return {
    type: FETCH_PREFERENCES_SUCCESS,
    data
  }
}
*/
export const UPDATE_PREFERENCES_REQUEST = 'UPDATE_PREFERENCES_REQUEST'
export const UPDATE_PREFERENCES_SUCCESS = 'UPDATE_PREFERENCES_SUCCESS'
export const UPDATE_PREFERENCES_FAILURE = 'UPDATE_PREFERENCES_FAILURE'
export const updatePreferences = (data) => {

  let today = new Date();
  today.setHours(0,0,0,0);

  if(!data._id || today.getTime() !== timestampFromObjectId(data._id)) delete data._id; //jestlize to neni dnesni datum predvoleb (starsi), tak se smaze attribut _id a vytvori se novy dokument

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [UPDATE_PREFERENCES_REQUEST, UPDATE_PREFERENCES_SUCCESS, UPDATE_PREFERENCES_FAILURE],
      promise: fetch('/api/preferences/'+(data._id ? data._id : ''), {
        method: data._id ? 'PUT' : 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      })
    }).then(() => humane.log('Předvolby byly uloženy'));
  }
}


export function updatePreferencesSuccess(data) {
  return {
    type: UPDATE_PREFERENCES_SUCCESS,
    data
  }
}


