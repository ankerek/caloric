import Food from '../models/food'
import { removeDiacritics } from '../../utils/removeDiacritics'

function randomNValue(min,max) {
  const value = Math.floor(Math.random()*(max-min+1)+min);
  return value > 0 ? value : 0;
}

export function updateFoodNames(req, res) {
  Food.find(function(err, food) {
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

  Food.findOne({_id: req.params.id }, function(err, food) {
    if (err) return next(err);

    res.json(food ? food : {});
  });
};



export function getListByName(req, res, next) {
	const arr = req.params.name.split(' ');



 	Food.find({_name: {$all: arr.map((val) => new RegExp('^'+val )) } }).limit(req.query.limit ? req.query.limit : 500 ).exec((err, food) => {
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

  Food.findOneAndUpdate({_id }, req.body.data, {/*upsert: true, */new: true, runValidators: true}, function(err, food) {
    if (err) return next(err);
    else res.json(food);
  });
};

export function setRandomValues (req, res) {
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
};