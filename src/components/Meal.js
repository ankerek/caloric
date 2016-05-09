import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import FoodItem from './FoodItem'

import { Row } from 'react-bootstrap'

export default class Meal extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    meal_id: PropTypes.string,
    food: PropTypes.instanceOf(Immutable.List)
  };
  
  render() {
    const { meal_id } = this.props;
    if(this.props.food)
    var food = this.props.food.map(function(item, i) {
      return (
        <Row key={i}>
          <FoodItem item={item} index={i} meal_id={meal_id} />
        </Row>
      );
    });
    
    return (
      <section>
        <h2>{ this.props.title }</h2>
        {food}
      </section>
    )
  }
}
