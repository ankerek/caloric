import moment from 'moment'
import { D_NUTRITION_VALUES } from '../dictionary'

export function calculateAge(birthday) {
	let birthday2;
	if(moment(birthday, 'D.M.YYYY', true).isValid()) birthday2 = moment(birthday, 'D.M.YYYY');
	else birthday2 = moment(birthday);

  return birthday ? moment().diff(birthday2, 'years') : 0;
}

export function calculateBmr({gender, birthday, weight, height}) {
	return Math.floor(10*weight + 6.25*height - 5*calculateAge(birthday) + (gender === 'male' ? 5 : -161));
}

export function calculateTee(preferences) {
	return Math.floor(calculateBmr(preferences) * preferences.activityFactor);
}

export function calculateNutritionValue({type, preferences}) {

	
	if(preferences.gender && preferences.birthday && preferences.weight && preferences.height && preferences.activityFactor) {
		switch(type) {
			case 'kcal':
				return calculateTee(preferences);
			case 'proteins':
				return Math.floor((calculateTee(preferences) * 0.214) / 4)
			case 'carbs':
				return Math.floor((calculateTee(preferences) * 0.524) / 4)
			case 'fats':
				return Math.floor((calculateTee(preferences) * 0.262) / 9)
			case 'n6fats':
				return Math.floor((calculateTee(preferences) * 0.075) / 9)
			case 'n3fats':
				return Math.floor((calculateTee(preferences) * 0.009) / 9)
			default:
				return getRecommendation({type, age: calculateAge(preferences.birthday), gender: preferences.gender});
		}
	}

	return '';
	
}

export function getRecommendation({type, age, gender}) {
	const recs = D_NUTRITION_VALUES[type].recommendations[gender];
	let k = -1;
	for(const key in recs) {
	  if(age < key) break;
	  k = key;
	}

	return recs[k];
}