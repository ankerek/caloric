import mongoose from 'mongoose'
import Meal from '../models/meal'
import Food from '../models/food'
import { countNutrient, hexSeconds, timestampFromObjectId } from '../../utils/utils'
import { D_NVS } from '../../dictionary'

function updateSums(data, food) {
  let modifier = {};


  let totalWeight = data.qty * data.weight;

  //if old values -> update action
  if(data.qty0 && data.weight0) {
    totalWeight = totalWeight - data.qty0 * data.weight0;
  }

  for (const property in food) {
    if (food.hasOwnProperty(property)) {
      if(D_NVS.hasOwnProperty(property)) {
        if(!modifier.$inc) modifier.$inc = {};
        modifier.$inc['nutritionValues.'+property] = countNutrient(food[property], totalWeight);
      }
    }
  }

  return modifier;
}


export function getListByDate(req, res, next) {
  Meal.find({_id: {$gt: req.query.from, $lt: req.query.to}, user_id: req.user._id }).lean().exec((err, food) => {
    if (err) return next(err);
    res.json(food);
  });
};

export function create(req, res, next) {
  const data = req.body;

  if(!data.hexSeconds || !data.meal) return next();

  const newId = data.hexSeconds + mongoose.Types.ObjectId().toString().substring(8);

  const item = data.meal.item;
  const nutritionValues = item.nutritionValues;

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
        weight: item.weight,
        nutritionValues
      }
    ]
  });
  
  for (const property in nutritionValues) {
    if (nutritionValues.hasOwnProperty(property)) {
      meal.nutritionValues[property] = countNutrient(nutritionValues[property], item.qty * item.weight);
    }
  }

  meal.save(function(err) {
    if (err) {
      return next(err);
    }
    res.status(201).json(meal);
  });
};

function mealFindByIdAndUpdate(data, req, res, next) {
  let query = {
    _id: data._id,
    user_id: req.user._id
  };
  if(data.item_id) query['items._id'] = mongoose.Types.ObjectId(data.item_id);

  Meal.findOneAndUpdate(query, data.modifier, {new: true}, (err, meal) => {
    if (err) next(err);
    else res.json(meal);
  });
}


export function update(req, res, next) {

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
      const nutritionValues = dataItem.nutritionValues;

      const item = {
        item_id: mongoose.Types.ObjectId(dataItem._id),
        _id: mongoose.Types.ObjectId(),
        name: dataItem.name,
        qty: dataItem.qty,
        weight: dataItem.weight,
        nutritionValues
      }

      for (const property in nutritionValues) {
        if (nutritionValues.hasOwnProperty(property)) {
          if(!modifier.$inc) modifier.$inc = {};
          modifier.$inc['nutritionValues.'+property] = countNutrient(nutritionValues[property], dataItem.qty * dataItem.weight);
        }
      }

      console.log(modifier);

      modifier.$push = { items: item };

      //Object.assign(modifier, updateSums({qty: item.qty, weight: item.weight}, data.meal.item));

      mealFindByIdAndUpdate({_id: meal_id, modifier}, req, res, next);

      break;
    case 'UPDATE_MEAL_FOOD_REQUEST':
    case 'REMOVE_MEAL_FOOD_REQUEST':

      Food.findById(data.item.item_id).lean().exec((err, food) => {
        if (err) return next(err);
        if (!food) return res.status(404).json('Potravina nebyla nalezena.');

        if(data.item.qty0) { // if there is old qty value -> update food
          modifier.$set = {};
          modifier.$set['items.$.qty'] = data.item.qty;
          modifier.$set['items.$.weight'] = data.item.weight;
        } else { //else delete food
          modifier = { 
            $pull: {
              items: { _id: mongoose.Types.ObjectId(data.item._id) }
            } 
          };
        }



        Object.assign(modifier, updateSums(data.item, food.nutritionValues));

        

        mealFindByIdAndUpdate({_id: meal_id, item_id: data.item._id, modifier}, req, res, next);

      });

      break;

  }

};