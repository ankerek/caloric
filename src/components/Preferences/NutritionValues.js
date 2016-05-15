import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { calculateNutritionValue } from '../../utils/preferences'
import { D_NVS } from '../../dictionary'

const NutritionValues = ({nutritionValues, preferences}) => {
  return (
    <div className="nutrition-values-list">
      <h3>Cíle</h3>
      <p>Cíle se doplňují automaticky z vypočtených hodnot. Můžete si ale nastavit vlastní.</p>

      {nutritionValues.map((nutritionValue, index) => 
        <Row key={index}>
          <Col xs={12} sm={6}>
            <div className="form-group">  
              <label>{D_NVS[nutritionValue.type.value].label}</label>
              <div className="input-group">
                <input type="number" className="form-control" disabled={nutritionValue.auto.value} {...nutritionValue.goal} />
                <div className="input-group-addon">{D_NVS[nutritionValue.type.value].unit}</div>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div className="btn-group">
            <Button bsStyle="success" disabled={index === 0} onClick={() => {
              nutritionValues.swapFields(index, index - 1)  // swap field with it's predecessor
            }}><i className="fa fa-caret-up" />
            </Button>
            <Button bsStyle="success" disabled={index === nutritionValues.length - 1} onClick={() => {
              nutritionValues.swapFields(index, index + 1)  // swap field with it's successor
            }}><i className="fa fa-caret-down" />
            </Button>
            </div>
            {' '}
            <Button bsStyle="warning" onClick={() => {
              nutritionValue.auto.onChange(false);
            }}>Upravit</Button>{' '}
            <Button bsStyle="info" onClick={() => {
              nutritionValue.auto.onChange(true);
              nutritionValue.goal.onChange(calculateNutritionValue({type: nutritionValue.type.value, preferences}));
            }}>Automaticky doplňovat</Button>{' '}
            {
                <Button bsStyle="danger" onClick={() => {
                  nutritionValues.removeField(index)
                }}>Odstranit</Button>
            }
            
          </Col>
        </Row>
      )}
    </div>
  )
}

export default NutritionValues