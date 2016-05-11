import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { fetchFoodList, resetFoodList, changeFoodListFilters } from '../../actions/food'
import { Row, Col, Table } from 'react-bootstrap'

import FindFoodInput from './FindFoodInput'
import SelectNutritionValues from './SelectNutritionValues'
import FoodListItems from './FoodListItems'

@connect(
  state => ({
    list: state.food.get('list'),
    filters: state.food.get('filters'),
    loading: state.food.get('loading')
  })
)
export default class FoodList extends React.Component {
  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  };

  constructor(props) {
    super(props);
  }

  // componentWillMount() {    
  //   if(this.props.location && this.props.location.action === 'PUSH') {
  //     this.constructor.fetchData({ store: this.props, params: this.props.params, baseUrl: '' });
  //   }
  // }
  // 
  findFoodList = (name) => {
    if(name.length === 0) this.props.dispatch(resetFoodList());
    else this.props.dispatch(fetchFoodList(name));
  };

  changeFilter = (filters) => {
    this.props.dispatch(changeFoodListFilters(filters));
  };
  
  render() {
    const { list, loading, filters } = this.props;
    const title = 'Potraviny';

    return (
      <div>
        <h1>{title} {loading && <i className="fa fa-refresh fa-spin fa-fw margin-bottom" aria-hidden="true"></i>}
          <span className="sr-only">Načítám...</span></h1>
        <Helmet title={title} />

        <Row>
          <Col md={4}><FindFoodInput findFoodList={this.findFoodList} /></Col>
          <Col md={8}><SelectNutritionValues changeFilter={this.changeFilter} value={filters} /></Col>
        </Row>
        <FoodListItems list={list} filters={filters} />
        
      </div>
    )
  }

}