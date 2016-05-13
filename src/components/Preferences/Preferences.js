import React, {PropTypes} from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { fetchPreferences, updatePreferences } from '../../actions/preferences'
import { timestampFromObjectId } from '../../utils/utils'
import { calculateBmr, calculateTee, calculateNutritionValue } from '../../utils/preferences'
import { getTimestampFromParams } from '../../utils/utils'
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

  static fetchData({ store, params, baseUrl }) {
    // const date = new Date();
    // date.setUTCHours(0,0,0,0);

    const timestamp = getTimestampFromParams(params);

    return store.dispatch(fetchPreferences({ baseUrl, timestamp }))
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

  handleSubmit = (data) => {

    let preferences = {...data};

    if(preferences.birthday) preferences.birthday = moment(preferences.birthday, 'D.M.YYYY').toDate();

    preferences.nutritionValues.forEach((nutritionValue) => {
      if(nutritionValue.auto) nutritionValue.goal = calculateNutritionValue({type: nutritionValue.type, preferences});
      else nutritionValue.goal = Number(nutritionValue.goal);
    });

    

    return this.props.dispatch(updatePreferences({preferences, params: this.props.params}));
  };

  render() {

    const {preferences} = this.props;
    

    return (
      <div>
        <h1>Předvolby</h1>
        <Helmet title="Předvolby"/>
        {preferences && preferences._id && <p>Zobrazeny předvolby ze dne {moment(timestampFromObjectId(preferences._id)).format('LL')}</p>}
        
        <PreferencesForm initialValues={preferences} onSubmit={this.handleSubmit} />
          

      </div>
    )
  }
}