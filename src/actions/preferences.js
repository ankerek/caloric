import { objectIdFromTimestamp, timestampFromObjectId, getTimestampFromParams } from '../utils/utils'
import 'isomorphic-fetch'
import * as ActionTypes from '.'
if ( process.env.BROWSER ) var humane = require('../utils/utils').humane;


export function fetchPreferences({baseUrl, timestamp, meals}) {
  const timestamp2 = timestamp + 24*60*60*1000;
  const objectId = objectIdFromTimestamp(timestamp2);

  return (dispatch, getState) => {
    const token = getState().auth.get('token');


    return dispatch({
      types: [ActionTypes.FETCH_PREFERENCES_REQUEST, ActionTypes.FETCH_PREFERENCES_SUCCESS, ActionTypes.FETCH_PREFERENCES_FAILURE],
      promise: fetch(baseUrl+'/api/preferences/' + objectId, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }),
      meals
    });
  }
}


export const updatePreferences = ({preferences, params}) => {

  let data = {...preferences};

  const timestamp = getTimestampFromParams(params);

  if(!data._id || timestamp !== timestampFromObjectId(data._id)) {
    delete data._id; //jestlize to neni dnesni datum predvoleb (starsi), tak se smaze atribut _id a vytvori se novy dokument
    data.timestamp = timestamp;
  }


  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [ActionTypes.UPDATE_PREFERENCES_REQUEST, ActionTypes.UPDATE_PREFERENCES_SUCCESS, ActionTypes.UPDATE_PREFERENCES_FAILURE],
      promise: fetch('/api/preferences/' + (data._id ? data._id : ''), {
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
