import React from 'react'
import Helmet from 'react-helmet'

import { connect } from 'react-redux'

import { Col } from 'react-bootstrap'

// @connect(
//   state => ({
//     food: state.meals.get('food'),
//   })
// )
export default class FoodDetail extends React.Component {

  // static fetchData({ store, params, baseUrl }) {
  //   return store.dispatch(fetchMeals({baseUrl, id}));
  // }

  // componentWillMount() {    
  //   if(this.props.location && this.props.location.action === 'PUSH') {
  //     this.constructor.fetchData({ store: this.props, params: this.props.params, baseUrl: '' });
  //   }
  // }
  
  render() {
    console.log(this.props)
    const {} = this.props;
    //const title = "Jídelníček";
  	
    return (
      <div>
        sddssd
      </div>
    )
  }

}