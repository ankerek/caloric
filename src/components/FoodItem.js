import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux'

import { updateMealFood, removeMealFood } from '../actions/meals'

import { InputGroup, FormControl, Col, Button } from 'react-bootstrap'



@connect()
export default class FoodItem extends React.Component {
	constructor(props) {
    super(props);

    const { item } = this.props;

    this.state = {
      editing: false,
      qty: item.get('qty'),
      weight: item.get('weight')
    };

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this); // diky tomuhle se pri pridani noveho jidla renderuje jen nove jidlo. misto vsech jidel
  }

  handleClick() {
    this.setState({
      editing: true
    });
  }

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

  editOnClick = () => {
    this.setState({
      editing: true
    });
  };

  removeOnClick = () => {
    const item = this.props.item;

    const data = {
      meal_id: this.props.meal_id,
      item: {
        index: this.props.index,
        qty: item.get('qty') * -1,
        weight: item.get('weight'),
        item_id: item.get('item_id'),
        _id: item.get('_id')
      }
    };

    this.setState({
      editing: false
    });

    this.props.dispatch(removeMealFood(data))
  };

  finishEdit = (e) => {
    e.preventDefault();
    const { item } = this.props;

    const newQty = this.state.qty;//parseInt(this.refs.qty.getValue());
    const newWeight = this.state.weight;//parseInt(this.refs.weight.getValue());
    //update food if qty or weight is different
    if(newQty !== item.get('qty') || newWeight !== item.get('weight')) {
      let data = {
        meal_id: this.props.meal_id,
        item: {
          index: this.props.index,
          qty0: item.get('qty'),
          qty: newQty,
          weight0: item.get('weight'),
          weight: newWeight,
          item_id: item.get('item_id'),
          _id: item.get('_id')
        }
      };

      this.props.dispatch(updateMealFood(data));
    }
      
    this.setState({
      editing: false
    });
  };

  itemOnBlur = (e) => {
    const currentTarget = e.currentTarget;
    
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.finishEdit();        
      }
    }, 0);
  };

  renderItem() {
    const { item } = this.props;
    //console.log('renderItem'+item.get('name'));
    return (
      <div>
        <Col md={6}>{item.get('name')} - {item.get('qty')} x {item.get('weight')}g</Col>
        <Col md={6}>
          <Button bsStyle="warning" bsSize="small" onClick={this.editOnClick}>Upravit</Button>
        </Col>
      </div>
    )
  }

  renderEdit() {
    return (
      <form onBlur={this.itemOnBlur} onSubmit={this.finishEdit}>
        <Col md={3}>
          <InputGroup>
            <FormControl 
              autoFocus={true}
              //defaultValue={item.get('qty')} 
              type="number" 
              value={this.state.qty} onChange={this.qtyOnChange}
              min="1" max="10000"       
              required />
              <InputGroup.Addon>ks</InputGroup.Addon>
            </InputGroup>
        </Col>
        <Col md={3}>
          <InputGroup>
            <FormControl 
              //defaultValue={item.get('weight')} 
              type="number" 
              value={this.state.weight} onChange={this.weightOnChange}
              min="1" max="10000"
              required />
            <InputGroup.Addon>g</InputGroup.Addon>
          </InputGroup>
        </Col>
        <Col md={6}>
          <Button bsStyle="success" type="submit">Uložit</Button> {' '}
          <Button bsStyle="danger" onClick={this.removeOnClick}>
            <i className="fa fa-trash-o" title="Odstranit"></i>
            <span className="sr-only">Odstranit</span>
          </Button>
        </Col>
      </form>
    )
  }
	
  render() {
    //console.log('re');
    if(this.state.editing) {
      return this.renderEdit();
    }
  	
    return this.renderItem();
  }
}
