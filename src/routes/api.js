import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from '../config'
import Food from '../models/food'
import Meal from '../models/meal'
import Preferences from '../models/preferences'
import User from '../models/user'

import { D_NUTRITION_VALUES } from '../dictionary'
import { countNutrient, hexSeconds, timestampFromObjectId } from '../utils/utils'
import { generateToken, extractToken, getCleanUser } from '../utils/auth'

const router = express.Router();


function randomNValue(min,max) {
  const value = Math.floor(Math.random()*(max-min+1)+min);
  return value > 0 ? value : 0;
}

router.get('/food', function(req, res) {
  Food.find(function(err, food) {
    if (err) res.json(err);

    res.json(food);
	});
});

router.get('/food/:id', function(req, res, next) {

  Food.findOne({_id: req.params.id }, function(err, food) {
    if (err) return next(err);

    res.json(food ? food : {});
  });
});



router.get('/food-list/:name', function(req, res, next) {
	const arr = req.params.name.split(' ');

	//or (var i = 0; i < arr.length; i++) arr[i] = new RegExp('^'+arr[i] );

 	Food.find({_name: {$all: arr.map((val) => new RegExp('^'+val )) } }).limit(10).exec((err, food) => {
    if (err) return next(err);

    res.json(food);
	});

});

router.get('/set-food', function(req, res) {
  Food.find(function(err, food) {
    if (err) res.send(err);

    food.forEach((item) => {
      // item.fiber = randomNValue(-4,5) * 10000;// -4 - 5 / 100g
      // item.kcal = item.kcal / 1000;
      // item.proteins = item.proteins / 1000;
      // item.carbs = item.carbs / 1000;
      // item.fats = item.fats / 1000;
      item.vitaminc = randomNValue(-10,50) * 1000;
      item.vitamind = randomNValue(-30,800) * 10;
      item.save();
    });

    res.json(food.length + 'edited');
  });
});

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

router.post('/signin', function(req, res, next) {
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
});

router.post('/signup', function(req, res, next) {
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

      res.json({ user: cleanUser, token });
    });

  });
});

//auth routes
//
router.use(expressJwt({ secret: config.secret}));


router.get('/meals/', function(req, res, next) {
  Meal.find({_id: {$gt: req.query.from, $lt: req.query.to}, user_id: req.user._id }, (err, food) => {
    if (err) return next(err);

    res.json(food);
  });
});

router.post('/meals', function(req, res, next) {
  const data = req.body;

  if(!data.hexSeconds || !data.meal) return next();

  const newId = data.hexSeconds + mongoose.Types.ObjectId().toString().substring(8);

  const item = data.meal.item;

  let meal = new Meal({
    _id: mongoose.Types.ObjectId(newId),
    user_id: mongoose.Types.ObjectId(req.user._id),
    type: data.meal.type,
    nutritionValues: {},
    items: [
      {
        item_id: mongoose.Types.ObjectId(item._id),
        _id: mongoose.Types.ObjectId(),
        name: item.name,
        qty: item.qty,
        weight: item.weight
      }
    ]
  });
  
  for (const property in item) {
    if (item.hasOwnProperty(property)) {
      if(D_NUTRITION_VALUES.hasOwnProperty(property)) {
        meal.nutritionValues[property] = countNutrient(item[property], item.qty * item.weight);

        meal.items[0][property] = item[property];
      }
    }
  }

  meal.save(function(err) {
    if (err) {
      return next(err);
    }
    res.status(201).json(meal);
  });
});

function updateSums(data, food) {
  let modifier = {};


  let totalWeight = data.qty * data.weight;

  //if old values -> update action
  if(data.qty0 && data.weight0) {
    totalWeight = totalWeight - data.qty0 * data.weight0;
  }

  for (const property in food) {
    if (food.hasOwnProperty(property)) {
      if(D_NUTRITION_VALUES.hasOwnProperty(property)) {
        if(!modifier.$inc) modifier.$inc = {};
        modifier.$inc['nutritionValues.'+property] = countNutrient(food[property], totalWeight);
      }
    }
  }

  return modifier;
}

function mealFindByIdAndUpdate(data, req, res, next) {
  let query = {
    _id: data._id,
    user_id: req.user._id
  };
  if(data.item_id) query['items._id'] = mongoose.Types.ObjectId(data.item_id);

  Meal.findOneAndUpdate(query, data.modifier, {new: true}, function(err, meal) {
    if (err) {
      return next(err);
    } else res.json(meal);
  });
}


router.put('/meals/:id', function(req, res, next) {

  const data = req.body;
  const meal_id = req.params.id;

  let modifier = {};

  switch(data.action) {
    case 'UPDATE_MEAL_REQUEST':
      /*
      { action: 'UPDATE_MEAL_REQUEST',
        meal:
         { item:
          { _id: '5662e95fc1eacfafbd83f552',
            name: 'banán',
            proteins: 1.03,
            carbs: 23.43,
            fats: 0.48,
            kj: 385,
            kcal: 92,
            qty: 1,
            weight: 1 } 
          }
        }
       */
      //data.meal.item._id = mongoose.Types.ObjectId(data.meal.item._id);
      const dataItem = data.meal.item;

      let item = {
        item_id: mongoose.Types.ObjectId(dataItem._id),
        _id: mongoose.Types.ObjectId(),
        name: dataItem.name,
        qty: dataItem.qty,
        weight: dataItem.weight
      }

      for (const property in dataItem) {
        if (dataItem.hasOwnProperty(property)) {
          if(D_NUTRITION_VALUES.hasOwnProperty(property)) {
            if(!modifier.$inc) modifier.$inc = {};
            modifier.$inc['nutritionValues.'+property] = countNutrient(dataItem[property], dataItem.qty * dataItem.weight);

            item[property] = dataItem[property];
          }
        }
      }

      console.log(modifier);

      modifier.$push = { items: item };

      //Object.assign(modifier, updateSums({qty: item.qty, weight: item.weight}, data.meal.item));

      mealFindByIdAndUpdate({_id: meal_id, modifier}, req, res, next);

      break;
    case 'UPDATE_MEAL_FOOD_REQUEST':
    case 'REMOVE_MEAL_FOOD_REQUEST':
      /*
      { action: 'UPDATE_MEAL_FOOD',
        item:
         { index: 1,
           qty0: 1,
           qty: 3,
           weight0: 1,
           weight: 1,
           _id: '5662e95fc1eacfafbd83f552' } }
       */
      //let index = parseInt(data.item.index);

      Food.findById(data.item.item_id, function(err, food) {
        if (err) return next(err);
        if (!food) {
          return res.status(404).json('Jídlo nebylo nalezeno.');
        }

        if(data.item.qty0) { // if there is old qty value -> update food
          modifier.$set = {};
          modifier.$set['items.$.qty'] = data.item.qty;
          modifier.$set['items.$.weight'] = data.item.weight;
        } else { //else delete food
          // const unsetMod = { 
          //   $unset: {
          //     'items': 1
          //   } 
          // };

          // console.log(unsetMod);

          // Meal.findOneAndUpdate({ _id: meal_id, user_id: req.user._id, 'items._id': mongoose.Types.ObjectId(data.item_id) }, unsetMod, (err) => {
          //   if (err) return next(err);
          // });

          modifier = { 
            $pull: {
              items: { _id: mongoose.Types.ObjectId(data.item._id) }
            } 
          };
        }



        Object.assign(modifier, updateSums(data.item, food.toJSON()));

        

        mealFindByIdAndUpdate({_id: meal_id, item_id: data.item._id, modifier}, req, res, next);

      });

      break;

  }

});

router.get('/preferences/', function(req, res, next) {
  if(!req.query.from || !req.query.to) return next();

  Preferences.find({_id: {$gt: req.query.from, $lt: req.query.to}, user_id: req.user._id }).sort({_id: 1}).exec((err, preferences) => {
    if (err) return next(err);  

    let prefs = [...preferences];


    if( (prefs.length && req.query.from !== timestampFromObjectId(prefs[0]._id)) || !prefs.length ) {
      Preferences.findOne({_id: {$lt: req.query.from}, user_id: req.user._id }).sort({_id: -1}).exec((err, preferences) => {
        if (err) return next(err);
        
        if(preferences) prefs.unshift(preferences);

        res.json(prefs);
      });
    } else res.json(prefs);
  });
});

router.get('/preferences/:to', function(req, res, next) {

  //var query = Preferences.find({_id: {$lte: req.params.to} }).sort({_id:-1}).limit(1);

  Preferences.findOne({_id: {$lt: req.params.to}, user_id: req.user._id }).sort({_id: -1}).exec(function(err, preferences) {
    if (err) return next(err);

    res.json(preferences ? preferences : {});
  });
});

router.post('/preferences', function(req, res, next) {

  const timestamp = new Date().setUTCHours(0,0,0,0);
  const _id = mongoose.Types.ObjectId(hexSeconds(timestamp) + mongoose.Types.ObjectId().toString().substring(8));

  const preferences = new Preferences({...req.body.data, _id, user_id: req.user._id});

  preferences.save((err, preferences) => {
    if (err) return next(err);
    res.json(preferences);
  });

  
});

router.put('/preferences/:id', function(req, res, next) {
  const _id = req.params.id;

  Preferences.findOneAndUpdate({_id, user_id: req.user._id }, req.body.data, {/*upsert: true, */new: true, runValidators: true}, function(err, preferences) {
    if (err) return next(err);
    else res.json(preferences);
  });
});


router.get('/check-auth', function(req, res, next) {

  const token = extractToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json('Token není k dispozici.');
  }

  jwt.verify(token, config.secret, function(err) {
    if (err) return next(err);

    res.json();
  });
});

router.get('/user', function(req, res, next) {

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
});





export default router