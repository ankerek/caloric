import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux'
import { addMeal, updateMeal } from '../actions/meals'

import {D_MEAL_TYPES} from '../dictionary'

import { Button, FormGroup, InputGroup, FormControl, Row, Col } from 'react-bootstrap'

import FindFoodAutosuggest from './FindFoodAutosuggest'

@connect()
export default class AddFood extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      food: null,
      reset: false,
      qty: '',
      weight: ''
    };

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  _findFoodOnUpdate = (val) => {
  	this.setState({food: val});
  };

  resetForm = () => {
    this.setState({
      reset: true,
      food: null,
      qty: '',
      weight: ''
    });
    this.refs.FindFoodAutosuggest.reset();
  };

  qtyOnChange = (event) => {
    this.setState({
      qty: event.target.value
    })
  };

  weightOnChange = (event) => {
    this.setState({
      weight: event.target.value
    })
  };

	handleSubmit(e) {
		e.preventDefault();
		
		const item = this.state.food;
		if(item) {
			const typeArr = this.refs.type.value.split('-');

      let newMeal = {
        item,
        type: typeArr[0]
      };
      
      //newMeal.item.qty = parseInt(this.refs.qty.getValue());
      //newMeal.item.weight = parseInt(this.refs.weight.getValue());
      
      newMeal.item.qty = parseInt(this.state.qty);
      newMeal.item.weight = parseInt(this.state.weight);

      delete item._name;
      delete item.__v;

      if(typeArr[1] !== '0') {
      	//newMeal.meal_id = typeArr[1];
        this.props.dispatch(updateMeal({meal_id: typeArr[1], meal: newMeal}));
      } else this.props.dispatch(addMeal({timestamp: this.props.timestamp, meal: newMeal}));

      this.resetForm();
		}
	}
	
  render() {

  	const {loading, meals} = this.props;

    const mealTypes = Object.keys(D_MEAL_TYPES).map((type, i) => {
      const meal = meals.find((meal) => meal.get('type') === type);
      const id = meal ? meal.get('_id') : '0';
      return (<option value={type+'-'+id} key={i}>{D_MEAL_TYPES[type]}</option>);
    });

    return (
    	<form onSubmit={this.handleSubmit.bind(this)}>
	    	<Row>
	    		<Col xs={12} sm={4} md={5}>
	    			<FindFoodAutosuggest onUpdate={this._findFoodOnUpdate} ref="FindFoodAutosuggest" />
				 	</Col>
				 	<Col xs={6} sm={2} md={2}>
            <FormGroup>
              <InputGroup>
                <FormControl type="number" min="1" max="10000" value={this.state.qty} onChange={this.qtyOnChange} required />
                <InputGroup.Addon>ks</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
					<Col xs={6} sm={2} md={2}>
            <FormGroup>
              <InputGroup>
                <FormControl type="number" min="1" max="10000" value={this.state.weight} onChange={this.weightOnChange} required />
                <InputGroup.Addon>g</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
					<Col xs={6} sm={2} md={2}>
						<select className="form-control" ref="type">{mealTypes}</select>
			    </Col>
					<Col xs={6} sm={1} md={1}><Button type="submit" disabled={loading}>Uložit</Button></Col>
				</Row>
			</form>
    )
  }
}