import 'isomorphic-fetch'
import * as ActionTypes from './'
import { objectIdFromTimestamp } from '../utils/utils'


export const fetchMealsForStats = ({baseUrl, range}) => {
  const objectId = objectIdFromTimestamp(range.first);
  const objectId2 = objectIdFromTimestamp(range.last);

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [ActionTypes.FETCH_MEALS_FOR_STATS_REQUEST, ActionTypes.FETCH_MEALS_FOR_STATS_SUCCESS, ActionTypes.FETCH_MEALS_FOR_STATS_FAILURE],
      promise: fetch(baseUrl+'/api/meals?from=' + objectId + '&to=' + objectId2, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    })
  }

}



export const fetchPreferencesForStats = ({baseUrl, range, meals}) => {
  const objectId = objectIdFromTimestamp(range.first);
  const objectId2 = objectIdFromTimestamp(range.last);

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [ActionTypes.FETCH_PREFERENCES_FOR_STATS_REQUEST, ActionTypes.FETCH_PREFERENCES_FOR_STATS_SUCCESS, ActionTypes.FETCH_PREFERENCES_FOR_STATS_FAILURE],
      promise: fetch(baseUrl+'/api/preferences?from=' + objectId + '&to=' + objectId2, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }),
      meals
    })
  }

}