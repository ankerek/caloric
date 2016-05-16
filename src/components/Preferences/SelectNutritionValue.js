import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import Select from 'react-select'

export default class SelectNutritionValue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nvToChoose: null
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.options.length !== this.props.options.length || nextState.nvToChoose !== this.state.nvToChoose;
  }

  nvToChooseOnChange = (option) => {
    this.setState({
      nvToChoose: option ? option.value : null
    });
  };

  onClick = () => {
    this.setState({
      nvToChoose: null
    });
    this.props.addNutritionValue(this.state.nvToChoose);
  };

  render() {
    const { options } = this.props;
    return (
      <div className="select-nutrition-value">
      {options.length > 0 && 
        <Row>
          <Col xs={8} sm={6}>
            <div className="form-group">
              <label>Přidat nutriční hodnotu ke sledování</label>
              <Select
                name="select-nutrition-values"
                placeholder="Vyberte nutriční hodnotu"
                options={options}
                onChange={this.nvToChooseOnChange}
                value={this.state.nvToChoose}
              />
            </div>
          </Col>
          <Col xs={4} sm={6}>
            <Button bsStyle="primary" disabled={!this.state.nvToChoose} onClick={this.onClick}><i/> Přidat
            </Button>
          </Col>
        </Row>
      }
      </div>
      )
  }
}
