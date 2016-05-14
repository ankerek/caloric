import React from 'react';
import { reduxForm } from 'redux-form'
import PureInput from '../PureInput'
import { Button, Alert } from 'react-bootstrap'
import { D_NVS, D_NVS_KEYS } from '../../dictionary'

const nvFields = D_NVS_KEYS.map((nv) => `nutritionValues.${nv}`);


const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Pole Název je povinné';
  }
  return errors;
};

@reduxForm({
    form: 'foodDetail',
    fields: [...nvFields, '_id', 'name' ],
    validate
  },
  undefined,
)
export default class FoodDetailForm extends React.Component {

  render() {

    const { fields: { name, nutritionValues }, handleSubmit, submitting, errors, pristine, invalid } = this.props;
    
    const inputs = Object.keys(nutritionValues).map((type, i) => {
      if(type === 'name' || type === '_id') return;
      return <PureInput type="number" min="0" step="0.01" label={D_NVS[type].label} addonAfter={D_NVS[type].unit} field={nutritionValues[type]} key={i} />
    }); 

    const errorMessages = Object.keys(errors).map((error, i) => <li key={i}>{errors[error]}</li>)
 
    return (
      <div>
        <Alert bsStyle="warning">Hodnoty se vyplňují v přepočtu na <strong>100g</strong> potraviny</Alert>
        <form onSubmit={handleSubmit}>
          <PureInput label="Název" field={name} />
          {inputs}

          { errorMessages.length > 0 && 
            <Alert bsStyle="danger">
              <ul>
                {errorMessages}
              </ul>
            </Alert> }

          <Button type="submit" bsStyle="success" bsSize="large" disabled={pristine || invalid || submitting}><i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Uložit</Button>
        </form>
      </div>
    )
  }
}