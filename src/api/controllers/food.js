import mongoose from 'mongoose'
import Food from '../models/food'
import Meal from '../models/meal'
import { removeDiacritics } from '../../utils/removeDiacritics'
import { D_NVS, D_NVS_KEYS } from '../../dictionary'

function randomNValue(min, max) {
  const value = Math.floor(Math.random()*(max-min+1)+min);
  return value > 0 ? value : 0;
}

export function updateFoodNames(req, res) {
  Food.find((err, food) => {
    if (err) res.send(err);
    var i;
    for (i = 0; i < food.length; i++) {
      var arr = removeDiacritics(food[i].name.toLowerCase()).split(' ');
      food[i]._name = arr;
      food[i].save();
    }
    res.json(food);
  });
};

export function getById(req, res, next) {

  Food.findOne({_id: req.params.id }, (err, food) => {
    if (err) return next(err);

    res.json(food ? food : {});
  });
};



export function getListByName(req, res, next) {
	const arr = req.params.name.split(' ');

 	Food.find({_name: {$all: arr.map((val) => new RegExp('^'+val )) } }).limit(req.query.limit ? req.query.limit : 500 ).lean().exec((err, food) => {
    if (err) return next(err);

    res.json(food);
	});

};

export function create(req, res, next) {
  const food = new Food(req.body.data);
  food._name = removeDiacritics(food.name.toLowerCase()).split(' ');
  food.save((err, food) => {
    if (err) return next(err);
    res.json(food);
  });
};

export function update(req, res, next) {
  const _id = req.params.id;



  Food.findOneAndUpdate({ _id }, req.body.data, {/*upsert: true, */new: true, runValidators: true}, (err, food) => {
    if (err) return next(err);
    else {


      Meal.find({'items.item_id': mongoose.Types.ObjectId(_id)}).exec((err, meals) => {
        if (err) return next(err);

        

        meals.forEach((meal) => {
          const items = meal.items.filter((item) => item.item_id.toString() === _id);

          items.forEach((item) => {
            D_NVS_KEYS.forEach((key) => {
              const oldValue = item.nutritionValues[key] ? item.nutritionValues[key] : 0;
              const newValue = food.nutritionValues[key] ? food.nutritionValues[key] : 0;
              const oldSum = meal.nutritionValues[key];

              item.nutritionValues[key] = newValue;
              meal.nutritionValues[key] = oldSum ? (oldSum - item.qty * item.weight * oldValue + item.qty * item.weight * newValue) : (item.qty * item.weight * newValue);
            })
          });

          meal.save();
        })  
        
        res.json(food);
      });

      // const nFood = food.toObject();
      // for(const key in nFood) {
      //   console.log(key)
      // }

      
    }
  });
};

export function setRandomValues(req, res) {
  Food.find((err, food) => {
    if (err) res.send(err);

    food.forEach((item) => {
      let n = item.nutritionValues;
      n.n6fats    = randomNValue(-80,800) * 100;
      n.n3fats    = randomNValue(-80,800) * 100;
      n.vitamina  = randomNValue(-100,350) * 10000;
      n.vitaminc  = randomNValue(-10,50) * 1000;
      n.vitamind  = randomNValue(-100,800) * 10;
      n.vitamine  = randomNValue(-100,800) * 10;
      n.vitamink  = randomNValue(-100,800) * 10;
      n.vitaminb1 = randomNValue(-100,800) * 1;
      n.vitaminb2 = randomNValue(-100,800) * 1;
      n.vitaminb3 = randomNValue(-100,800) * 10;
      n.vitaminb6 = randomNValue(-100,800) * 1;
      n.vitaminb11 = randomNValue(-100,350) * 1000;
      n.vitaminb12 = randomNValue(-100,800) * 1;
      n.vitaminb5 = randomNValue(-100,800) * 10;
      n.vitaminbh = randomNValue(-100,800) * 10;
      n.choline = randomNValue(-100,350) * 100;
      n.calcium = randomNValue(-100,750) * 1000;
      n.vitaminh = randomNValue(-300,800) * 10;
      n.calcium = randomNValue(-100,750) * 1000;
      n.chromium = randomNValue(-100,750) * 100;   
      n.copper = randomNValue(-100,750) * 100;     
      n.sodium = randomNValue(-300,800) * 10;
      n.fluorid = randomNValue(-300,800) * 1;
      n.iodine = randomNValue(-300,800) * 100;
      n.iron = randomNValue(-300,800) * 100;
      n.magnesium = randomNValue(-300,800) * 100;
      n.manganese = randomNValue(-300,800) * 10;
      n.molybden = randomNValue(-300,800) * 10;
      n.phosphorus = randomNValue(-100,750) * 1000;
      n.selenium = randomNValue(-300,800) * 10;
      n.zinc = randomNValue(-300,800) * 10;
      n.potassium = randomNValue(-300,800) * 10;
      n.sodium = randomNValue(-300,800) * 10;

      item.save();
    });

    res.json(food.length + 'edited');
  });
};