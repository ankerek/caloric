import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { calculateNutritionValue } from '../../utils/preferences'
import { D_NVS } from '../../dictionary'

const NutritionValues = ({nutritionValues, preferences}) => {
  return (
    <div>
      <h3>Cíle</h3>
      <p>Cíle se doplňují automaticky z vypočtených hodnot. Můžete si ale nastavit vlastní.</p>

      {nutritionValues.map((nutritionValue, index) => 
        <Row key={index}>
          <Col xs={6}>
            <div className="form-group">  
              <label>{D_NVS[nutritionValue.type.value].label}</label>
              <div className="input-group">
                <input type="number" className="form-control" disabled={nutritionValue.auto.value} {...nutritionValue.goal} />
                <div className="input-group-addon">{D_NVS[nutritionValue.type.value].unit}</div>
              </div>
            </div>
          </Col>
          <Col xs={6}>
            <Button bsStyle="warning" style={{marginTop: '24px'}} onClick={() => {
              nutritionValue.auto.onChange(false);
            }}>Upravit</Button>{' '}
            <Button bsStyle="info" style={{marginTop: '24px'}} onClick={() => {
              nutritionValue.auto.onChange(true);
              nutritionValue.goal.onChange(calculateNutritionValue({type: nutritionValue.type.value, preferences}));
            }}>Automaticky doplňovat</Button>{' '}
            {
              D_NVS[nutritionValue.type.value].weight !== 0 ? 
                <Button bsStyle="danger" style={{marginTop: '24px'}} onClick={() => {
                  nutritionValues.removeField(index)
                }}>Odstranit</Button>
               : null
            }
            
          </Col>
        </Row>
      )}
    </div>
  )
}

export default NutritionValues