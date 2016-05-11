import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Table } from 'react-bootstrap'
import { D_NUTRITION_VALUES } from '../../dictionary'


export default class FoodListItems extends React.Component {
  constructor(props) {
    super(props);
    //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { list, filters } = this.props;


    const foodList = list.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item.get('name')}</td>
          {
            filters.map((filter, j) => <td key={j}>{item.has(filter.value) ? item.get(filter.get('value')) / 10000 : 0}</td>)
          }
        </tr>
      );
    });
    
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Název</th>
            {
              filters.map((filter, i) => <th key={i}>{D_NUTRITION_VALUES[filter.get('value')].label}</th>)
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
