import React from 'react'
import { Row, Col, Button, Panel, Table, Alert } from 'react-bootstrap'
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

  render() {
    const { options, addNutritionValue } = this.props;
    return (
      <div>
      {options.length > 0 && 
        <Row>
          <Col xs={6}>
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
          <Col xs={6}>
            <Button bsStyle="primary" style={{marginTop: '24px'}} disabled={this.state.nvToChoose ? false : true} onClick={() => {
              addNutritionValue(this.state.nvToChoose);
            }}><i/> Přidat
            </Button>
          </Col>
        </Row>
      }
      </div>
      )
  }
}
