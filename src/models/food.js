import mongoose from 'mongoose'
import { D_NUTRITION_VALUES } from '../dictionary'

const Schema = mongoose.Schema;

const nutritionValues = Object.keys(D_NUTRITION_VALUES).reduce((previous, current) => {
  previous[current] = Number;
  return previous;
}, {});

const schema = {
	name: String,
  _name: [String]
}

const FoodSchema = new Schema({...schema, ...nutritionValues});

export default mongoose.model('Food', FoodSchema, 'food');