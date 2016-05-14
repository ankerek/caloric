if ( process.env.BROWSER ) var humane = require('./utils').humane;

export default function promiseMiddleware({dispatch, getState}) {
  return (next) => (action) => {
    
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { promise, types, ...rest } = action;
    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ ...rest, type: REQUEST });
    return promise.then((response) => {
      const json = response.json();
      if (response.status >= 200 && response.status < 300) return json;
      else return json.then(Promise.reject.bind(Promise));
    }).then(
      (result) => {
        return next({ ...rest, result, type: SUCCESS });
      },
      (error) => {
        console.error('MIDDLEWARE ERROR:', error);
        if ( typeof error === 'string' && process.env.BROWSER ) humane.error(error);
        next({...rest, error, type: FAILURE});
        return Promise.reject(error);
      }
    )
  };
}