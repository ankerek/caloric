import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { fetchFoodDetail } from '../../actions/food'
import FoodDetailForm from './FoodDetailForm'
import { Col, Table } from 'react-bootstrap'
import { D_NVS } from '../../dictionary'

@connect(
  state => ({
    food: state.food.get('detail'),
  })
)
export default class FoodDetail extends React.Component {

  static fetchData({ baseUrl, store, params }) {
    return store.dispatch(fetchFoodDetail({ baseUrl, id: params.id }));
  }

  constructor(props) {
    super(props);

    this.state = {
      weight: 100,
      error: null
    };
  }

  componentWillMount() {
    this.constructor.fetchData({ store: this.props, params: this.props.params, baseUrl: '' });
  }

  changeWeight = (e) => {
    const value = e.target.value;
    if(value > 1000000000 || value < 1) 
      this.setState({
        error: true
      });
    else this.setState({
      weight: e.target.value,
      error: false
    });
  };
  
  render() {
    const { food } = this.props;
    const error = this.state.error;
    const title = food.get('name');
  	
    const nutritionValues = Object.keys(D_NVS).map((type, i) => <tr key={i}><td>{D_NVS[type].label}</td><td>{food.hasIn(['nutritionValues', type]) ? Math.round(food.getIn(['nutritionValues', type]) / 100 * this.state.weight * 100 )/100 : 0}{D_NVS[type].unit}</td></tr>);

    return (
      <div>
        <h1>{title}</h1>
        <Helmet title={title} />

        <Link to={'/potravina/'+food.get('_id')+'/editace'}>Upravit potravinu</Link>

        <form className="form-inline">
          <p className="form-control-static">Zobrazit nutriční hodnoty na</p>
          { ' ' }
          <div className="form-group">        
            <div className="input-group">
              <input type="number" className="form-control" value={this.state.weight} onChange={this.changeWeight} />
              <div className="input-group-addon">g</div>
            </div>            
          </div>
          { ' ' }
          <p className="form-control-static">potraviny</p>
          {error && <span className="help-block" style={{color:'#a94442'}}>Může být pože mezi 1 a 1000000000g</span>}
        </form>
        <Table>
          <thead>
            <tr>
              <th>Nutriční hodnota</th>
              <th>Hodnota na {this.state.weight}g potraviny</th>
            </tr>
          </thead>
          <tbody>
            {nutritionValues}
          </tbody>
        </Table>
      </div>
    )
  }

}