import React from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router'
import { D_NVS } from '../../dictionary'

export default class FoodListItems extends React.Component {

  render() {
    const { list, filters } = this.props;

    const foodList = list.map((item, i) => {
      return (
        <tr key={i}>
          <td><Link to={'/potravina/'+item.get('_id')}>{item.get('name')}</Link></td>
          {
            filters.map((filter, j) => <td key={j}>{item.hasIn(['nutritionValues', filter.get('value')]) ? item.getIn(['nutritionValues', filter.get('value')]) / 10000 : 0}</td>)
          }
        </tr>
      );
    });
    
    return (
      <Table striped bordered condensed hover responsive>
        <thead>
          <tr>
            <th>Název</th>
            {
              filters.map((filter, i) => <th key={i}>{D_NVS[filter.get('value')].label} ({D_NVS[filter.get('value')].unit})</th>)
            }
          </tr>
        </thead>
        <tbody>
          {foodList}
        </tbody>
      </Table>
    )
  }
}
