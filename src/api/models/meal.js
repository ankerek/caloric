import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const MealSchema = new Schema({
  user_id: Schema.Types.ObjectId,
  type: { type: String, required: true }, 
  items: [],
  nutritionValues: Schema.Types.Mixed,
  kj: Number,
  kcal: Number,
  proteins: Number,
  carbs: Number,
  fats: Number,
  fiber: Number
});

export default mongoose.model('Meal', MealSchema, 'meals');