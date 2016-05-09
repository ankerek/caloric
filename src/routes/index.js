var express = require('express');
var router = express.Router();
var functions = require('../functions');

import Food from '../models/food'






router.get('/update-food', function(req, res) {
	Food.find(function(err, food) {
    if (err) res.send(err);
    var i;
		for (i = 0; i < food.length; i++) {
			var arr = functions.removeDiacritics(food[i].name.toLowerCase()).split(' ');
	    food[i]._name = arr;
	    food[i].save();
		}
    res.json(food);
	});
});

module.exports = router;
