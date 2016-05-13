import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import Preferences from '../models/preferences'
import { generateToken, extractToken, getCleanUser } from '../../utils/auth'
import { hexSeconds } from '../../utils/utils'

function isUserUnique(reqBody, cb) {
  const username = reqBody.username ? reqBody.username.trim() : '';
  const email = reqBody.email ? reqBody.email.trim() : '';

  User.findOne({
    $or: [{
      'username': new RegExp(['^', username, '$'].join(''), 'i')
    }, {
      'email': new RegExp(['^', email, '$'].join(''), 'i')
    }]
  }, function(err, user) {
    if (err) return next(err);

    if (!user) {
      cb();
      return;
    }

    let error;
    if (user.username === username || user.email === email) error = 'Uživatelské jméno nebo e-mail již existuje.';

    cb(error);
  });
}

export function signin(req, res, next) {
  const body = req.body;

  User.findOne({username: body.username}, function(err, user) {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json('Uživatelské jméno neexistuje.');
    }

    bcrypt.compare(body.password, user.password, function(err, valid) {
      if (!valid) {
        return res.status(401).json('Uživatelské jméno nebo heslo je špatně.');
      }

      const cleanUser = getCleanUser(user);
      const token = generateToken(cleanUser);

      res.json({
        user: cleanUser,
        token
      });
    });
  });
};

export function signup(req, res, next) {
  const body = req.body;

  if(!body.username || !body.email || !body.password) return next();

  isUserUnique(body, function(err) {
    if (err) {
      return res.status(400).json(err);
    }

    const hash = bcrypt.hashSync(body.password.trim(), 10);
    const user = new User({
      username: body.username.trim(),
      email: body.email.trim(),
      password: hash
    });

    user.save(function(err, user) {
      if (err) return next(err);

      const cleanUser = getCleanUser(user);
      const token = generateToken(user);

      const timestamp = new Date().setUTCHours(0,0,0,0);
      const _id = mongoose.Types.ObjectId(hexSeconds(timestamp) + mongoose.Types.ObjectId().toString().substring(8));

      const preferences = new Preferences({...body, _id, user_id: user._id});

      preferences.save((err, preferences) => {
        if (err) return next(err);

        res.json({ user: cleanUser, token });
      });

      
    });

  });
};

/*
 * get logged user by token from headers
 */
export function getLogged(req, res, next) {

  const token = extractToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json('Token není k dispozici.');
  }

  jwt.verify(token, 'tajnyKlic', function(err, user) {
    if (err) return next(err);
    //return user using the id from w/in JWTToken
    User.findById(user._id, function(err, user) {
      if (err) return next(err);

      const cleanUser = getCleanUser(user);

      res.json({
        user: cleanUser,
        token
      });

    });
  });
};
