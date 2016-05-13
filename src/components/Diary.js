import React from 'react'
//import PureRenderMixin from 'react-addons-pure-render-mixin'
import Helmet from 'react-helmet'

import { connect } from 'react-redux'
import { fetchMeals } from '../actions/meals'
import { fetchPreferences } from '../actions/preferences'
import DayNavigation from './DayNavigation'
import Meals from './Meals'
import Information from './Information'
import AddFood from './AddFood'

import { Col } from 'react-bootstrap'

import { getTimestampFromParams } from '../utils/utils'

@connect(
  state => ({
    meals: state.meals.get('meals'),
    loadingMeals: state.meals.get('loading'),
    nutritionValues: state.nutritionValues.get('list')
  })
)
export default class Diary extends React.Component {

  static fetchData({ store, params, baseUrl }) {
    const timestamp = getTimestampFromParams(params);
    return store.dispatch(fetchMeals({baseUrl, timestamp}))
      .then((response) => {
        let meals = {};
        if(response && response.result) meals = response.result;
        return store.dispatch(fetchPreferences({baseUrl, timestamp, meals}));
      });
  }

  componentWillMount() {    
    if(this.props.location && this.props.location.action === 'PUSH') {
      this.constructor.fetchData({ store: this.props, params: this.props.params, baseUrl: '' });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.constructor.fetchData({ store: this.props, params: nextProps.params, baseUrl: '' });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) return false;
    return true;
  }
  
  render() {
    
    const { meals, nutritionValues, loadingMeals, params } = this.props;

    const timestamp = getTimestampFromParams(this.props.params);
    const title = "Jídelníček";
  	
    return (
      <div className="main">
        <h1>{title} {loadingMeals && <i className="fa fa-refresh fa-spin fa-fw margin-bottom" aria-hidden="true"></i>}
          <span className="sr-only">Načítám...</span></h1>
        <Helmet title={title}/>
        <DayNavigation timestamp={timestamp} />

        <AddFood timestamp={timestamp} meals={meals} loading={loadingMeals} />
        <Col md={8}>
          <Meals meals={meals}/>
        </Col>
        <Col md={4}>
          <Information nutritionValues={nutritionValues} params={params}  />
        </Col>
      </div>
    )
  }

}

// const mapStateToProps = (state) => {
//   return {
//     meals: state.meals.get('meals'),
//     loadingMeals: state.meals.get('loading'),
//     nutritionValues: state.nutritionValues.get('list')
//   }
// }

// export default connect(mapStateToProps)(Diary)