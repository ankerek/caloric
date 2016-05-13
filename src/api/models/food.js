import mongoose from 'mongoose'
import { D_NVS } from '../../dictionary'

const Schema = mongoose.Schema;

const nutritionValues = Object.keys(D_NVS).reduce((previous, current) => {
  previous[current] = Number;
  return previous;
}, {});

const FoodSchema = new Schema({
  name: { type: String, required: true },
  _name: { type: [String], required: true },
  nutritionValues
});

export default mongoose.model('Food', FoodSchema, 'food');