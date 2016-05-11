import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Row, Col, Button, Panel, Table, Alert } from 'react-bootstrap'
import Select from 'react-select'
import { D_NUTRITION_VALUES } from '../../dictionary'

const options = Object.keys(D_NUTRITION_VALUES).map((type, i) => {
  return {value: type, label: D_NUTRITION_VALUES[type].label}
});

export default class SelectNutritionValues extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   value: [
    //     { value: 'kcal', label: 'Kilokalorie' },
    //     { value: 'proteins', label: 'Bílkoviny' },
    //     { value: 'carbs', label: 'Sacharidy' },
    //     { value: 'fats', label: 'Tuky' }
    //   ]
    // };

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  onChange = (value) => {
    this.setState({
      value
    });

    this.props.changeFilter(value);
  };

  render() {
    const { value } = this.props;
    return (
      <div className="form-group">
        <label>Zobrazit nutriční hodnoty</label>
        <Select
          multi
          name="select-nutrition-values"
          placeholder="Vyberte nutriční hodnoty"
          options={options}
          onChange={this.onChange}
          value={value.toJS()}
        />
      </div>
    )
  }
}
