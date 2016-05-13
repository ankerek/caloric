import mongoose from 'mongoose'
import Preferences from '../models/preferences'
import { hexSeconds, timestampFromObjectId } from '../../utils/utils'

export function getByDate(req, res, next) {
  if(!req.query.from || !req.query.to) return next();

  Preferences.find({_id: {$gt: req.query.from, $lt: req.query.to}, user_id: req.user._id }).sort({_id: 1}).lean().exec((err, preferences) => {
    if (err) return next(err);  

    let prefs = [...preferences];


    if( (prefs.length && req.query.from !== timestampFromObjectId(prefs[0]._id)) || !prefs.length ) {
      Preferences.findOne({_id: {$lt: req.query.from}, user_id: req.user._id }).sort({_id: -1}).lean().exec((err, preferences) => {
        if (err) return next(err);
        
        if(preferences) prefs.unshift(preferences);

        res.json(prefs);
      });
    } else res.json(prefs);
  });
};

export function getLatestByDate(req, res, next) {

  //var query = Preferences.find({_id: {$lte: req.params.to} }).sort({_id:-1}).limit(1);

  Preferences.findOne({_id: {$lt: req.params.id}, user_id: req.user._id }).sort({_id: -1}).lean().exec(function(err, preferences) {
    if (err) return next(err);

    res.json(preferences ? preferences : {});
  });
};

export function create(req, res, next) {

  const timestamp = new Date().setUTCHours(0,0,0,0);
  const _id = mongoose.Types.ObjectId(hexSeconds(timestamp) + mongoose.Types.ObjectId().toString().substring(8));

  const preferences = new Preferences({...req.body.data, _id, user_id: req.user._id});

  preferences.save((err, preferences) => {
    if (err) return next(err);
    res.json(preferences);
  });
  
};


export function update(req, res, next) {
  const _id = req.params.id;

  Preferences.findOneAndUpdate({_id, user_id: req.user._id }, req.body.data, {/*upsert: true, */new: true, runValidators: true}, function(err, preferences) {
    if (err) return next(err);
    else res.json(preferences);
  });
};