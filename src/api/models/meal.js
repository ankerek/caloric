import mongoose from 'mongoose'
import { D_NVS, D_NVS_KEYS } from '../../dictionary'

const Schema = mongoose.Schema;

const nutritionValues = D_NVS_KEYS.reduce((previous, current) => {
  previous[current] = Number;
  return previous;
}, {});

const item = {
  _id: Schema.Types.ObjectId,
  item_id: Schema.Types.ObjectId,
  name: String,
  qty: Number,
  weight: Number,
  nutritionValues
}

const MealSchema = new Schema({
  user_id: Schema.Types.ObjectId,
  type: { type: String, required: true }, 
  items: [item],
  nutritionValues,
  kj: Number,
  kcal: Number,
  proteins: Number,
  carbs: Number,
  fats: Number,
  fiber: Number
});

export default mongoose.model('Meal', MealSchema, 'meals');