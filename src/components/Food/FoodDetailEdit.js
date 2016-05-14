import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { fetchFoodDetail, updateFood, clearFoodDetail } from '../../actions/food'
import FoodDetailForm from './FoodDetailForm'

if ( process.env.BROWSER ) var humane = require('../../utils/utils').humane;

@connect(
  state => ({
    food: state.food.get('detail'),
  })
)
export default class FoodDetail extends React.Component {

  static fetchData({ store, params, baseUrl, pathname }) {
    return pathname !== '/pridat-potravinu' ? store.dispatch(fetchFoodDetail({ baseUrl, id: params.id })) : Promise.resolve();
  }

  componentWillMount() {
    if(this.props.location.pathname === '/pridat-potravinu') this.props.dispatch(clearFoodDetail());
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location.pathname === '/pridat-potravinu') this.props.dispatch(clearFoodDetail());
  }

  handleSubmit = (data) => {

    let nData = {...data};
    let nutritionValues = nData.nutritionValues;

    for(const property in nutritionValues) { 
      if (nutritionValues.hasOwnProperty(property)) {
        if(nutritionValues[property] == null) break;
        else nutritionValues[property] *= 10000;
      }
    }

    return this.props.dispatch(updateFood(nData)).then(({ result }) => {
      humane.log('Potravina byla uložena');
      browserHistory.push('/potravina/' + result._id);
    });
  };
  
  render() {
    const { food } = this.props;
    const title = food.has('name') ? food.get('name') : 'Přidat potravinu';

    return (
      <div>
        <h1>{title}</h1>
        <Helmet title={title} />
        <FoodDetailForm initialValues={food.toJS()} onSubmit={this.handleSubmit} />
      </div>
    )
  }

}