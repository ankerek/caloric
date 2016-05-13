import express from 'express'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from '../config'

import * as FoodController from './controllers/food'
import * as UserController from './controllers/user'
import * as MealController from './controllers/meal'
import * as PreferencesController from './controllers/preferences'



const router = express.Router();

//Food routes

router.route('/update-food')
  .get(FoodController.updateFoodNames)

router.route('/set-food')
  .get(FoodController.setRandomValues)

router.route('/food/:id')
  .get(FoodController.getById)

router.route('/food-list/:name')
  .get(FoodController.getListByName)




//User auth routes


router.route('/signin')
  .post(UserController.signin)

router.route('/signup')
  .post(UserController.signup)

/**
 * Routes that need authentication
 */
router.use(expressJwt({ secret: config.secret}));

router.route('/food')
  .post(FoodController.create)

router.route('/food/:id')
  .put(FoodController.update)


//user routes
router.route('/user')
  .get(UserController.getLogged)

//meal routes
router.route('/meals')
  .get(MealController.getListByDate)
  .post(MealController.create)

router.route('/meals/:id')
  .put(MealController.update)

//preferences routes
router.route('/preferences')
  .get(PreferencesController.getByDate)
  .post(PreferencesController.create)

router.route('/preferences/:id')
  .get(PreferencesController.getLatestByDate)
  .put(PreferencesController.update)


export default router