import jwt from 'jsonwebtoken'
import { browserHistory } from 'react-router'
import { logout } from '../actions/auth'

export function generateToken(user) {
  var u = {
    _id: user._id.toString(),
    username: user.username
  };

  return jwt.sign(u, 'tajnyKlic', {
    expiresIn: 60 * 60 * 24 // expires in 24 hours
  });
}

export function extractToken(header) {
  return header && header.split(' ')[1] !== 'undefined' ? header.split(' ')[1] : undefined;
}

export function getCleanUser(user) {
  var u = user.toJSON();
  return {
    _id: u._id,
    username: u.username,
    email: u.email
  }
}

export function logoutAndRedirect(dispatch) {
  return dispatch(logout()).then(() => browserHistory.push('/prihlaseni'));
}

