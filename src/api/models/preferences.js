import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const PreferencesSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, required: true },
  weight: { type: Number, required: true },
  birthday: { type: Date, required: true },
  height: { type: Number, required: true },
  gender: { type: String, required: true },
  activityFactor: { type: Number, required: true },
  nutritionValues: []
});

export default mongoose.model('Preferences', PreferencesSchema, 'preferences');