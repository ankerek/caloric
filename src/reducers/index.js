import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'

import auth from './auth'
import meals from './meals'
import nutritionValues from './nutritionValues'
import preferences from './preferences'
import statistics from './statistics'
import food from './food'


export default combineReducers({
  auth,
  meals,
  nutritionValues,
  preferences,
  statistics,
  food,
  form
});