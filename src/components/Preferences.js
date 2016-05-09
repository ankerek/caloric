import React, {PropTypes} from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { fetchPreferences, updatePreferences } from '../actions/forms'
import { timestampFromObjectId } from '../utils/utils'
import { calculateBmr, calculateTee, calculateNutritionValue } from '../utils/preferences'

import PreferencesForm from './PreferencesForm'

import moment from 'moment'

@connect(
  state => ({
    preferences: state.preferences
  })
)
export default class Preferences extends React.Component {
  static propTypes = {
    preferences: PropTypes.object.isRequired
  };
	constructor(props) {
    super(props);

    this.state = {
      editing: false
    };
  }

  static fetchData({ store, baseUrl }) {
    const date = new Date();
    date.setHours(0,0,0,0);

    return store.dispatch(fetchPreferences({baseUrl, timestamp: date.getTime()}))
  }

  componentDidMount() {
    if(this.props.location && this.props.location.action === 'PUSH') {
      this.constructor.fetchData({ store: this.props, baseUrl: '' });
    }
  }

  handleSubmit(data) {

    let preferences = {...data};

    if(preferences.birthday) preferences.birthday = moment(preferences.birthday, 'D.M.YYYY').toDate();

    preferences.nutritionValues.forEach((nutritionValue) => {
      if(nutritionValue.auto) nutritionValue.goal = calculateNutritionValue({type: nutritionValue.type, preferences});
      else nutritionValue.goal = Number(nutritionValue.goal);
    });

    

    this.props.dispatch(updatePreferences(preferences));
  }

  render() {

    const {preferences} = this.props;
    const calculated = () => {
      if(preferences.gender && preferences.birthday && preferences.weight && preferences.height && preferences.activityFactor) {

        return (
          <div className="bg-info">
            Bazální metabolismus: {calculateBmr(preferences)} kcal<br />
            TEE: {calculateTee(preferences)} kcal
          </div>
          )
      } else return 'Pro spočtení doporučených hodnot je třeba zadat všechny předchozí údaje.';
    }

    return (
      <div>
        <h1>Předvolby</h1>
        <Helmet title="Předvolby"/>
        {preferences && preferences._id && <p>Předvolby naposled vyplněny dne {moment(timestampFromObjectId(preferences._id)).format('LL')}</p>}
        
        <PreferencesForm initialValues={preferences} onSubmit={this.handleSubmit.bind(this)} calculated={calculated} />
          

      </div>
    )
  }
}


// const mapStateToProps = (state) => {
//   console.log(state);
//   return {
//     preferences: state.preferences,
//     //preferences: state.preferences && state.preferences.has('birthday') && state.preferences.get('birthday') != null ? state.preferences.set('birthday', moment(state.preferences.get('birthday')).format('D.M.YYYY') ) : state.preferences,
//   }
// }