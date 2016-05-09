import 'isomorphic-fetch'
import { objectIdFromTimestamp } from '../utils/utils'

export const FETCH_MEALS_FOR_STATS_REQUEST = 'FETCH_MEALS_FOR_STATS_REQUEST'
export const FETCH_MEALS_FOR_STATS_SUCCESS = 'FETCH_MEALS_FOR_STATS_SUCCESS'
export const FETCH_MEALS_FOR_STATS_FAILURE = 'FETCH_MEALS_FOR_STATS_FAILURE'
export const fetchMealsForStats = ({baseUrl, range}) => {
  const objectId = objectIdFromTimestamp(range.first);
  const objectId2 = objectIdFromTimestamp(range.last);

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [FETCH_MEALS_FOR_STATS_REQUEST, FETCH_MEALS_FOR_STATS_SUCCESS, FETCH_MEALS_FOR_STATS_FAILURE],
      promise: fetch(baseUrl+'/api/meals?from=' + objectId + '&to=' + objectId2, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    })
  }

}


export const FETCH_PREFERENCES_FOR_STATS_REQUEST = 'FETCH_PREFERENCES_FOR_STATS_REQUEST'
export const FETCH_PREFERENCES_FOR_STATS_SUCCESS = 'FETCH_PREFERENCES_FOR_STATS_SUCCESS'
export const FETCH_PREFERENCES_FOR_STATS_FAILURE = 'FETCH_PREFERENCES_FOR_STATS_FAILURE'
export const fetchPreferencesForStats = ({baseUrl, range, meals}) => {
  const objectId = objectIdFromTimestamp(range.first);
  const objectId2 = objectIdFromTimestamp(range.last);

  return (dispatch, getState) => {
    const token = getState().auth.get('token');

    return dispatch({
      types: [FETCH_PREFERENCES_FOR_STATS_REQUEST, FETCH_PREFERENCES_FOR_STATS_SUCCESS, FETCH_PREFERENCES_FOR_STATS_FAILURE],
      promise: fetch(baseUrl+'/api/preferences?from=' + objectId + '&to=' + objectId2, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }),
      meals
    })
  }

}