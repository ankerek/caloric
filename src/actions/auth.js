import 'isomorphic-fetch'
import cookie from 'react-cookie'
import config from '../config'
import * as ActionTypes from '.'

//if ( process.env.BROWSER ) const humane = require('../utils/utils').humane;


export function fetchUser({baseUrl}) {
  return function (dispatch, getState) {
    const token = getState().auth.get('token');

    if(!token) return;

    return dispatch({
      types: [ActionTypes.FETCH_USER_REQUEST, ActionTypes.FETCH_USER_SUCCESS, ActionTypes.FETCH_USER_FAILURE],
      promise: fetch(baseUrl+'/api/user', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    })
  } 
}


export const signup = (data) => {

  //const { username, email, password } = data;

  return {
    types: [ActionTypes.SIGNUP_REQUEST, ActionTypes.SIGNUP_SUCCESS, ActionTypes.SIGNUP_FAILURE],
    promise: fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }
  
}


export const signin = (data) => {
  
  return (dispatch) => {
    const { username, password } = data;


    return dispatch({
      types: [ActionTypes.SIGNIN_REQUEST, ActionTypes.SIGNIN_SUCCESS, ActionTypes.SIGNIN_FAILURE],
      promise: fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
    }).then(
      ({result}) => {
        cookie.save('token', result.token, { 
          path: '/',
          expires: new Date(Date.now() + config.authExpiration *  1000)
        });
        return result;
      }
    )
    
  }

}

export function signinSuccess(result) {
  return {
    type: ActionTypes.SIGNIN_SUCCESS,
    result
  }
}

export function signinFailure(result) {
  return {
    type: ActionTypes.SIGNIN_FAILURE,
    message: result.message
  }
}


export const logout = () => {
  return (dispatch) => {
    cookie.remove('token', { path: '/' });
    dispatch({ type: ActionTypes.LOGOUT_SUCCESS });

    return Promise.resolve();
  }
}

// export function logoutSuccess() {
//   return {
//     type: LOGOUT_SUCCESS
//   }
// }