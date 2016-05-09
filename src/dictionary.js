// export const D_NUTRIENTS = new Map([
// 	['kcal', ['kalorie', 0]],
//   ['proteins', ['bílkoviny', 0]],
//   ['carbs', ['sacharidy', 0]],
//   ['fats', ['tuky', 0]],
//   ['fiber', ['vlaknina', 1]]
// ]);

export const D_NUTRITION_VALUES = {
	kcal: {
		label: 'Kilokalorie',
		unit: 'kcal',
		weight: 0
	},
	proteins: {
		label: 'Bílkoviny',
		unit: 'g',
		weight: 0,
		recommendations: {
			male: {	1: 12.5, 4: 20, 18: 22.5 },
			female: { 1: 12.5, 4: 20, 18: 22.5 }
		}
	},
	carbs: {
		label: 'Sacharidy',
		unit: 'g',
		weight: 0
	},
	fats: {
		label: 'Tuky',
		unit: 'g',
		weight: 0
	},
	n6fats: {
		label: 'Omega-6 nenasycené mastné kyseliny',
		unit: 'g',
		weight: 1
	},
	n3fats: {
		label: 'Omega-3 nenasycené mastné kyseliny',
		unit: 'g',
		weight: 1
	},
	fiber: {
		label: 'Vláknina',
		unit: 'g'
	},
	//vitamins
	vitamina: {
		label: 'Vitamín A',
		unit: 'µg',
		recommendations: {
			male: {	1: 300, 4: 400, 9: 600,	14: 900 },
			female: { 1: 300, 4: 400, 9: 600, 14: 700 }
		}
	},
	vitaminc: {
		label: 'Vitamín C',
		unit: 'mg',
		recommendations: {
			male: {	1: 15, 4: 25, 9: 45, 14: 75, 19: 90 },
			female: { 1: 15, 4: 25, 9: 45, 14: 65, 19: 75 }
		}
	},
	vitamind: {
		label: 'Vitamín D',
		unit: 'µg',
		recommendations: {
			male: {	1: 15, 70: 20 },
			female: { 1: 15, 70: 20 }
		}
	},
	vitamine: {
		label: 'Vitamín E',
		unit: 'mg',
		recommendations: {
			male: {	1: 6, 4: 7, 9: 11, 14: 15 },
			female: { 1: 6, 4: 7, 9: 11, 14: 15 }
		}
	},
	vitamink: {
		label: 'Vitamín K',
		unit: 'µg',
		recommendations: {
			male: {	1: 30, 4: 55, 9: 60, 14: 75, 19: 120 },
			female: { 1: 30, 4: 55, 9: 60, 14: 75, 19: 90 }
		}
	},
	vitaminb1: {
		label: 'Vitamín B1 (thiamin)',
		unit: 'mg',
		recommendations: {
			male: {	1: 0.5, 4: 0.6, 9: 0.9, 19: 1.2 },
			female: { 1: 0.5, 4: 0.6, 9: 0.9, 14: 1, 19: 1.1 }
		}
	},
	vitaminb2: {
		label: 'Vitamín B2 (riboflavin)',
		unit: 'mg',
		recommendations: {
			male: {	1: 0.5, 4: 0.6, 9: 0.9, 19: 1.3 },
			female: { 1: 0.5, 4: 0.6, 9: 0.9, 14: 1, 19: 1.1 }
		}
	},
	vitaminb3: {
		label: 'Vitamín B3 (niacin)',
		unit: 'mg',
		recommendations: {
			male: {	1: 6, 4: 8, 9: 12, 19: 16 },
			female: {	1: 6, 4: 8, 9: 12, 19: 14 }
		}
	},
	vitaminb6: {
		label: 'Vitamín B6',
		unit: 'mg',
		recommendations: {
			male: {	1: 0.5, 4: 0.6, 9: 1, 14: 1.3, 51: 1.7 },
			female: {	1: 0.5, 4: 0.6, 9: 1, 14: 1.2, 19: 1.3, 51: 1.5 }
		}
	},
	vitaminb11: {
		label: 'Vitamín B11 (kyselina listová)',
		unit: 'µg',
		recommendations: {
			male: {	1: 150, 4: 200, 9: 300, 14: 400 },
			female: {	1: 150, 4: 200, 9: 300, 14: 400 }
		}
	},
	vitaminb12: {
		label: 'Vitamín B12',
		unit: 'µg',
		recommendations: {
			male: {	1: 0.9, 4: 1.2, 9: 1.8, 14: 2.4 },
			female: {	1: 0.9, 4: 1.2, 9: 1.8, 14: 2.4 }
		}
	},
	vitaminb5: {
		label: 'Vitamín B5 (kyselina pantothenová)',
		unit: 'mg',
		recommendations: {
			male: {	1: 2, 4: 3, 9: 4, 14: 5 },
			female: {	1: 2, 4: 3, 9: 4, 14: 5 }
		}
	},
	vitaminh: {
		label: 'Vitamín H',
		unit: 'µg',
		recommendations: {
			male: {	1: 8, 4: 12, 9: 20, 14: 25, 19: 30 },
			female: {	1: 8, 4: 12, 9: 20, 14: 25, 19: 30 }
		}
	},
	choline: {
		label: 'Cholin',
		unit: 'mg',
		recommendations: {
			male: {	1: 200, 4: 250, 9: 375, 14: 550, 19: 30 },
			female: {	1: 200, 4: 250, 9: 375, 14: 400, 19: 425 }
		}
	},
	//minerals
	calcium: {
		label: 'Vápník',
		unit: 'mg',
		recommendations: {
			male: {	1: 700, 4: 1000, 9: 1300, 19: 1000, 70: 1200 },
			female: {	1: 700, 4: 1000, 9: 1300, 19: 1000, 51: 1200 }
		}
	},
	chromium: {
		label: 'Chrom',
		unit: 'µg',
		recommendations: {
			male: {	1: 11, 4: 15, 9: 25, 19: 35, 51: 30 },
			female: {	1: 11, 4: 15, 9: 21, 14: 24, 19: 25, 51: 20 }
		}
	},
	copper: {
		label: 'Měď',
		unit: 'µg',
		recommendations: {
			male: {	1: 340, 4: 440, 9: 700, 14: 890, 19: 900 },
			female: {	1: 340, 4: 440, 9: 700, 14: 890, 19: 900 }
		}
	},
	fluorid: {
		label: 'Fluór',
		unit: 'mg',
		recommendations: {
			male: {	1: 0.7, 4: 1, 9: 2, 14: 3, 19: 4 },
			female: {	1: 0.7, 4: 1, 9: 2, 14: 3 }
		}
	},
	iodine: {
		label: 'Jór',
		unit: 'µg',
		recommendations: {
			male: {	1: 90, 4: 90, 9: 120, 14: 150 },
			female: {	1: 90, 4: 90, 9: 120, 14: 150 }
		}
	},
	iron: {
		label: 'Železo',
		unit: 'mg',
		recommendations: {
			male: {	1: 7, 4: 10, 9: 8, 14: 11, 19: 8 },
			female: {	1: 7, 4: 10, 9: 8, 14: 15, 19: 18, 51: 8 }
		}
	},
	magnesium: {
		label: 'Hořčík',
		unit: 'mg',
		recommendations: {
			male: {	1: 80, 4: 130, 9: 240, 14: 410, 19: 400, 31: 420 },
			female: {	1: 80, 4: 130, 9: 240, 14: 360, 19: 310, 31: 320 }
		}
	},
	manganese: {
		label: 'Mangan',
		unit: 'mg',
		recommendations: {
			male: {	1: 1.2, 4: 1.5, 9: 1.9, 14: 2.2, 19: 2.3 },
			female: {	1: 1.2, 4: 1.5, 9: 1.6, 19: 1.8 }
		}
	},
	molybden: {
		label: 'Molybden',
		unit: 'µg',
		recommendations: {
			male: {	1: 17, 4: 22, 9: 34, 14: 43, 19: 45 },
			female: {	1: 17, 4: 22, 9: 34, 14: 43, 19: 45 }
		}
	},
	phosphorus: {
		label: 'Fosfor',
		unit: 'mg',
		recommendations: {
			male: {	1: 460, 4: 500, 9: 1250, 19: 700 },
			female: {	1: 460, 4: 500, 9: 1250, 19: 700 }
		}
	},
	selenium: {
		label: 'Selen',
		unit: 'µg',
		recommendations: {
			male: {	1: 20, 4: 30, 9: 40, 19: 55 },
			female: {	1: 20, 4: 30, 9: 40, 19: 55 }
		}
	},
	zinc: {
		label: 'Zinek',
		unit: 'mg',
		recommendations: {
			male: {	1: 3, 4: 5, 9: 8, 19: 11 },
			female: {	1: 3, 4: 5, 9: 8, 14: 9, 19: 8 }
		}
	},
	potassium: {
		label: 'Draslík',
		unit: 'g',
		recommendations: {
			male: {	1: 3, 4: 3.8, 9: 4.5, 19: 4.7 },
			female: {	1: 3, 4: 3.8, 9: 4.5, 19: 4.7 }
		}
	},
	sodium: {
		label: 'Sodík',
		unit: 'g',
		recommendations: {
			male: {	1: 1, 4: 1.2, 9: 1.5, 51: 1.3, 70: 1.2 },
			female: {	1: 1, 4: 1.2, 9: 1.5, 51: 1.3, 70: 1.2 }
		}
	},
	chlorid: {
		label: 'chlorid',
		unit: 'g',
		recommendations: {
			male: {	1: 1.5, 4: 1.9, 9: 1.3, 51: 2, 70: 1.8 },
			female: {	1: 1.5, 4: 1.9, 9: 1.3, 51: 2, 70: 1.8 }
		}
	},

};

export const D_MEAL_TYPES = {
	breakfast: 'Snídaně',
	lunch: 'Oběd',
	dinner: 'Večeře',
};

export const D_MONTHS = [ 'leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec' ]