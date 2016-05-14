import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Select from 'react-select'
import { D_NVS } from '../../dictionary'

const options = Object.keys(D_NVS).map((type) => {
  return {value: type, label: D_NVS[type].label}
});

export default class SelectNutritionValues extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  onChange = (value) => {
    const newValue = value ? value : [];
    this.setState({
      newValue
    });

    this.props.changeFilter(newValue);
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
