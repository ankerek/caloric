import { List, Map, fromJS, Record } from 'immutable'
import * as ActionTypes from '../src/actions'
import authReducer, { initialState as authInitialState } from '../src/reducers/auth'
import foodReducer, { initialState as foodInitialState } from '../src/reducers/food'
import mealsReducer, { initialState as mealsInitialState } from '../src/reducers/meals'
import nutritionValuesReducer, { initialState as nutritionValuesInitialState } from '../src/reducers/nutritionValues'
import preferencesReducer, { initialState as preferencesInitialState } from '../src/reducers/preferences'
import statisticsReducer, { initialState as statisticsInitialState } from '../src/reducers/statistics'
import { D_NVS } from '../src/dictionary'
import { expect } from 'chai'

describe('reducers', () => {

  const user = require('./test_data').user

  describe('auth', () => {
    it('handles FETCH_USER_SUCCESS', () => {

      const action = { result: user, type: ActionTypes.FETCH_USER_SUCCESS };

      const nextState = authReducer(authInitialState, action);

      expect(nextState).to.equal(fromJS(user));
    });

    it('handles SIGNIN_SUCCESS', () => {

      const action = { result: user, type: ActionTypes.SIGNIN_SUCCESS };

      const nextState = authReducer(authInitialState, action);

      expect(nextState).to.equal(fromJS(user));
    });

    it('handles LOGOUT_SUCCESS', () => {
      const prevState = authInitialState.mergeDeep(fromJS(user));

      const action = { type: ActionTypes.LOGOUT_SUCCESS };

      const nextState = authReducer(prevState, action);

      expect(nextState).to.equal(authInitialState);
    });

  });

  describe('food', () => {
    it('handles FETCH_FOOD_LIST_REQUEST', () => {

      const action = { type: ActionTypes.FETCH_FOOD_LIST_REQUEST };

      const nextState = foodReducer(foodInitialState, action);

      expect(nextState).to.equal(fromJS({
        loading: true,
        filters: List(),
        list: List(),
        detail: Map()
      }));
    });
    it('handles FETCH_FOOD_LIST_FAILURE', () => {

      const action = { type: ActionTypes.FETCH_FOOD_LIST_FAILURE };

      const nextState = foodReducer(foodInitialState, action);

      expect(nextState).to.equal(fromJS({
        loading: false,
        filters: List(),
        list: List(),
        detail: Map()
      }));
    });

    it('handles FETCH_FOOD_LIST_SUCCESS', () => {
      const result = require('./test_data').foodList

      const action = { result, type: ActionTypes.FETCH_FOOD_LIST_SUCCESS };

      const nextState = foodReducer(foodInitialState, action);

      expect(nextState).to.equal(fromJS({
        loading: false,
        filters: List(),
        list: fromJS(result),
        detail: Map()
      }));
    });

    it('handles CLEAR_FOOD_LIST', () => {
      const list = require('./test_data').foodList
      const prevState = foodInitialState.mergeDeep(fromJS({list}));

      const action = { type: ActionTypes.CLEAR_FOOD_LIST };

      const nextState = foodReducer(prevState, action);

      expect(nextState).to.equal(foodInitialState);
    });

    it('handles CHANGE_FOOD_LIST_FILTERS', () => {

      const filters =  [
        {
          "value": "n6fats",
          "label": "Omega-6 nenasycené mastné kyseliny"
        }
      ]

      const action = { filters, type: ActionTypes.CHANGE_FOOD_LIST_FILTERS };

      const nextState = foodReducer(foodInitialState, action);

      expect(nextState).to.equal(fromJS({
        loading: false,
        filters: fromJS(filters),
        list: List(),
        detail: Map()
      }));
    });

  });


  describe('meals', () => {

    const meal = {
      _id: 2,
      type: 'lunch',
      items: [
        {name: 'banan', weight: 1, qty: 5, nutritionValues: {kcal: 20, proteins: 3}}
      ]
    };
    
    const mealsResult = require('./test_data').mealsList;
    it('handles FETCH_MEALS_SUCCESS', () => {
      const action = { result: mealsResult, type: ActionTypes.FETCH_MEALS_SUCCESS };

      const nextState = mealsReducer(mealsInitialState, action);

      expect(nextState).to.equal(fromJS({
        loading: false,
        meals: fromJS(mealsResult)
      }));
    });

    it('handles ADD_MEAL_SUCCESS', () => {
      const prevState = mealsInitialState.mergeDeep(fromJS({ 
        meals: [...mealsResult[0]]
       }));

      const action = { result: mealsResult[1], type: ActionTypes.ADD_MEAL_SUCCESS };

      const nextState = mealsReducer(prevState, action);

      expect(nextState).to.equal(fromJS({
        loading: false,
        meals: fromJS(mealsResult)
      }));
    });

    it('handles UPDATE_MEAL_SUCCESS', () => {
      const prevState = mealsInitialState.mergeDeep(fromJS({ 
        meals: mealsResult
       }));

      const action = { result: mealsResult[0], type: ActionTypes.UPDATE_MEAL_SUCCESS };

      const nextState = mealsReducer(prevState, action);

      expect(nextState).to.equal(fromJS({
        loading: false,
        meals: fromJS(mealsResult)
      }));
    });


  });

  describe('nutritionValues', () => {

    const meal = {
      _id: '2',
      type: 'lunch',
      items: [
        {name: 'banan', weight: 1, qty: 5, nutritionValues: {kcal: 20, proteins: 3}}
      ],
      nutritionValues: {kcal: 20, proteins: 3}
    };
    
    const mealsResult = [{
      _id: '1',
      nutritionValues: {
        kcal: 10,
        proteins: 20
      }
    }];
    const preferencesResult = {
      nutritionValues: [
        {type: 'kcal', goal: 200}
      ]
    };

    const result = [{
      type: 'kcal',
      goal: 200,
      value: 10,
      meals: {
        '1': 10
      }
    }];

    it('handles FETCH_PREFERENCES_SUCCESS', () => {
      const action = { meals: mealsResult, result: preferencesResult, type: ActionTypes.FETCH_PREFERENCES_SUCCESS };

      const nextState = nutritionValuesReducer(nutritionValuesInitialState, action);

      expect(nextState).to.equal(fromJS({
        list: fromJS(result)
      }));
    });



    it('handles ADD_MEAL_SUCCESS', () => {

      const prevState = nutritionValuesInitialState.mergeDeep(fromJS({ 
        list: fromJS(result)
       }));
      const action = { result: meal, type: ActionTypes.ADD_MEAL_SUCCESS };

      const nextState = nutritionValuesReducer(prevState, action);

      expect(nextState).to.equal(nutritionValuesInitialState.mergeDeep(fromJS({
        list: fromJS([{
          type: 'kcal',
          goal: 200,
          value: 30,
          meals: {
            '1': 10,
            '2': 20
          }
        }])
      })));
    });


  });

  describe('preferences', () => {

    const result = {
      gender: 'male',
      weight: 50
    }

    it('handles FETCH_PREFERENCES_SUCCESS', () => {
      const action = { result, type: ActionTypes.FETCH_PREFERENCES_SUCCESS };

      const nextState = preferencesReducer({}, action);
    });


  });

  describe('statistics', () => {

    const meal = {
      _id: '2',
      type: 'lunch',
      items: [
        {name: 'banan', weight: 1, qty: 5, nutritionValues: {kcal: 20, proteins: 3}}
      ],
      nutritionValues: {kcal: 20, proteins: 3}
    };
    
    const mealsResult = [{
      _id: '572d13e069e611b40a977923',
      nutritionValues: {
        kcal: 10,
        proteins: 20
      }
    }];
    const preferencesResult = [{
      _id: '572d13e069e611b40a977924',
      nutritionValues: [
        {type: 'kcal', goal: 200}
      ]
    }];

    let result = {};

    for(const key in D_NVS) {
      result[key] = {
        goals: {
          '1462492800000': key==='kcal' ? 200 : 0
        },
        values: {}
      }
    }

    it('handles FETCH_PREFERENCES_FOR_STATS_SUCCESS', () => {
      const action = { meals: [], result: preferencesResult, type: ActionTypes.FETCH_PREFERENCES_FOR_STATS_SUCCESS };

      const nextState = statisticsReducer(statisticsInitialState, action);

      expect(nextState).to.equal(statisticsInitialState.mergeDeep(fromJS({
        loading: false,
        map: fromJS(result)
      })));
    });


  });

});