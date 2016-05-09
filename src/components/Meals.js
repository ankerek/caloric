import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Meal from './Meal'

import { D_MEAL_TYPES } from '../dictionary'



export default class Meals extends React.Component {
  static propTypes = {
    meals: PropTypes.instanceOf(Immutable.List).isRequired
  };

	constructor(props) {
    super(props);
  }
 
  getMealByType(type) {
    if(!this.props.meals) return null;
    const index = this.props.meals.findIndex((meal) => meal.get('type') === type);
    
    return index !== (-1) ? this.props.meals.get(index) : null;
  }

  getMealIdFoodByType(type) {
    const meal = this.getMealByType(type);

    if(!meal) return {};

    return {
      _id: meal.get('_id'),
      food: meal.get('items')
    }
  }

  render() {

    const meals = Object.keys(D_MEAL_TYPES).map((type, i) => {
      const {_id, food} = this.getMealIdFoodByType(type);
      return (<Meal title={D_MEAL_TYPES[type]} food={food} meal_id={_id} key={i} />);
    });

    return (
      <div className="meals">
      	{meals}
      </div>
    )

  }
}