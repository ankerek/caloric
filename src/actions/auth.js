import 'isomorphic-fetch'
import cookie from 'react-cookie'

//if ( process.env.BROWSER ) const humane = require('../utils/utils').humane;

export function checkAuth(token) {
  return function (dispatch) {
    return dispatch({
      types: ['CHECK_AUTH_REQUEST', 'CHECK_AUTH_SUCCESS', 'CHECK_AUTH_FAILURE'],
      promise: fetch('http://localhost:3000/api/check-auth/', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    })
  } 
}

export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST'
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE'
export function fetchUser({baseUrl}) {
  return function (dispatch, getState) {
    const token = getState().auth.get('token');

    if(!token) return;

    return dispatch({
      types: [FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE],
      promise: fetch(baseUrl+'/api/user', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    })
  } 
}


export const SIGNUP_REQUEST = 'SIGNUP_REQUEST'
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE'
export const signup = (data) => {

  const { username, email, password } = data;

  return {
    types: [SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE],
    promise: fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    })
  }

  /*
  return fetch('/api/signup', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })
  .then(response => response.json())
  .then(json => {
    if(json.status === 'error') {
      humane.error(json.message);
      return json;
    }
    else humane.log('Registrace proběhla úspěšně');
  })
  .catch(error => {
    return humane.error(error)
  });
  */
  
}

export const SIGNIN_REQUEST = 'SIGNIN_REQUEST'
export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS'
export const SIGNIN_FAILURE = 'SIGNIN_FAILURE'
export const signin = (data) => {
  
  return (dispatch) => {
    const { username, password } = data;

    return fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then((response) => {
      const json = response.json();
      if (response.status >= 200 && response.status < 300) return json;
      else return json.then(Promise.reject.bind(Promise));
    })
    .then(
      (result) => {
        cookie.save('token', result.token, { 
          path: '/',
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        return dispatch(signinSuccess(result));
      },
      (error) => {
        dispatch(signinFailure({message: error}));
        return Promise.reject(error);
      }
    )
  }

}

export function signinSuccess(result) {
  return {
    type: SIGNIN_SUCCESS,
    result
  }
}

export function signinFailure(result) {
  return {
    type: SIGNIN_FAILURE,
    message: result.message
  }
}

export const logout = () => {
  console.log('logout');
  return (dispatch) => {
    cookie.remove('token', { path: '/' });
    dispatch(logoutSuccess());

    return Promise.resolve();
  }
}

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS
  }
}