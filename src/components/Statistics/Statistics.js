import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { fetchMealsForStats, fetchPreferencesForStats } from '../../actions/statistics'
import moment from 'moment'
import { Map } from 'immutable'
import Select from 'react-select'
import DatePicker from 'react-date-picker'
import { Row, Col } from 'react-bootstrap'
import MainGraph  from './MainGraph'
import NVGraph  from './NVGraph'

import { D_NUTRITION_VALUES, D_MONTHS } from '../../dictionary'

let nvOptions = Object.keys(D_NUTRITION_VALUES).map((type) => {
  return {
    value: type,
    label: D_NUTRITION_VALUES[type].label
  }
});

nvOptions.unshift({value: 'main', label: 'Energetický příjem rozdělený do makronutrientů'});


@connect(
  state => ({
    statistics: state.statistics.get('map'),
    loading: state.statistics.get('loading')
  })
)
export default class Statistics extends React.Component {

  static propTypes = {
    statistics: PropTypes.instanceOf(Map)
  };

  static fetchData({ store, baseUrl, range }) {
    if(!range) {
      const last = moment().utc().add(1, 'days').startOf('day').unix() * 1000;
      const first = moment(last).subtract(30, 'days').unix() * 1000;
      var range = {
        first,
        last
      };
    }
    return store.dispatch(fetchMealsForStats({baseUrl, range}))
      .then((response) => {
        let meals = {};
        if(response && response.result && response.result) meals = response.result;
        return store.dispatch(fetchPreferencesForStats({baseUrl, range, meals}));
      });
  }
  
  constructor(props) {
    super(props);

    const today = new Date();

    const last = moment().utc().add(1, 'days').startOf('day').unix() * 1000;
    const first = moment(last).subtract(30, 'days').unix() * 1000;

    this.state = {
      nv: null,
      year: today.getFullYear(),
      month: '',
      range: {
        first,
        last
      }
    };
  }

  componentWillMount() {    
    if(this.props.location && this.props.location.action === 'PUSH') {
      this.constructor.fetchData({ store: this.props, params: this.props.params, baseUrl: '' });
    }
  }

  nvOnChange = (option) => {
    this.setState({
      nv: option ? option.value : null
    });
  };

  yearOnChange = (event) => {
    const year = event.target.value;
    this.setState({
      year,
      range: this.changeRange({year})
    });
  };

  monthOnChange = (event) => {
    const month = event.target.value;
    this.setState({
      month,
      range: this.changeRange({month})
    });
  };

  changeRange = ({year, month}) => {
    let first = moment.utc(this.state.range.first);
    let last = moment.utc(this.state.range.last);
    if(year) {
      first.year(year);
      last.year(year);
    }
    if(month) {
      first.month(month).startOf('month');
      last.month(month).endOf('month');
    }

    const range = {
      first: first.unix() * 1000,
      last: last.unix() * 1000
    }

    this.constructor.fetchData({ store: this.props, params: this.props.params, baseUrl: '', range });

    return range;
  };

  getNVData = () => {
    const { statistics } = this.props;

    const nvType = this.state.nv === 'main' ? 'kcal' : this.state.nv;
    const main = this.state.nv === 'main';

    const goals = statistics.getIn([nvType, 'goals']);
    const values = statistics.getIn([nvType, 'values']);
    if(main) {
      var proteins = statistics.getIn(['proteins', 'values']);
      var carbs = statistics.getIn(['carbs', 'values']);
      var fats = statistics.getIn(['fats', 'values']);
    }

    const goalsTimestamps = goals.keySeq().map(nv => Number(nv)).toJS();
    goalsTimestamps.sort((a, b) => {
      if(a > b) return 1;
      else if(a < b) return -1;
      return 0;
    });

    const firstDay = this.state.range.first;
    const daysCnt = Math.round(Math.abs(this.state.range.last - firstDay) / (1000 * 60 * 60 * 24));

    let goalsData = [];
    let valuesData = [];
    let xLabelValues = [];
    if(main) {
      var proteinsData = [];
      var carbsData = [];
      var fatsData = [];
    }

    for(let i = 0; i < daysCnt; i++) {
      const timestamp = firstDay + 86400000 * i;
      const timestampS = String(timestamp);
      xLabelValues.push(timestamp);
      goalsData.push({
        x: timestamp,
        y: goals.has(timestampS) ? goals.get(timestampS) : goalsData[i-1] ? goalsData[i-1].y : goals.has(String(goalsTimestamps[0])) ? goals.get(String(goalsTimestamps[0])) : 0
      });
      valuesData.push({
        x: timestamp,
        y: values.has(timestampS) ? Math.round(values.get(timestampS) / 1000000) : 0
      });
      if(main) {
        proteinsData.push({
          x: timestamp,
          y: proteins.has(timestampS) ? Math.round(proteins.get(timestampS) / 1000000 * 4) : 0
        });
        carbsData.push({
          x: timestamp,
          y: carbs.has(timestampS) ? Math.round(carbs.get(timestampS) / 1000000 * 4) : 0
        });
        fatsData.push({
          x: timestamp,
          y: fats.has(timestampS) ? Math.round(fats.get(timestampS) / 1000000 * 9) : 0
        });
      }
    }


    const data = {
      goals: goalsData,
      values: valuesData,
      xLabelValues
    }

    return main ? {...data, proteins: proteinsData, carbs: carbsData, fats: fatsData} : data;
  };

  render() {
    const { loading } = this.props;
    const nv = this.state.nv;
    const currentYear = new Date().getFullYear();

    let years = [];

    for(let i = currentYear; i > currentYear - 10; i--) {
      years.push(i);
    }

    const yearsOptions = years.map(year => <option value={year} key={year}>{year}</option>);
    let monthsOptions = D_MONTHS.map((month, i) => <option value={i} key={i}>{month}</option>);
    monthsOptions.unshift(<option key={-1}>Vyberte měsíc</option>);
    console.log('stat');
    return (
      <div>
        <h1>Statistika {loading && <i className="fa fa-refresh fa-spin fa-fw margin-bottom" aria-hidden="true"></i>}
          <span className="sr-only">Načítám...</span></h1>
        <Helmet title="Statistika"/>
        <Row>
          <Col md={6}>
            <Select
              name="select-nutrition-value"
              placeholder="Vyberte údaj"
              options={nvOptions}
              onChange={this.nvOnChange}
              value={nv}
            />
          </Col>
          <Col md={3}><select onChange={this.yearOnChange} value={this.state.year} className="form-control">{yearsOptions}</select></Col>
          <Col md={3}><select onChange={this.monthOnChange} value={this.state.month} className="form-control">{monthsOptions}</select></Col>
        </Row>
        {nv && <h2>Období od {moment(this.state.range.first).format('D.M.Y')} do {moment(this.state.range.last).format('D.M.Y')}</h2>}
        {nv && nv !== 'main' && <NVGraph data={this.getNVData()} type={nv} />}
        {nv && nv === 'main' && <MainGraph data={this.getNVData()} />}
      </div>
    )
  }
}
