import React from 'react';
import { reduxForm } from 'redux-form'
import Helmet from 'react-helmet'
import PureInput from '../PureInput'
import { Row, Col, Button, Alert } from 'react-bootstrap'
import { D_NUTRITION_VALUES } from '../../dictionary'

const fields = [...Object.keys(D_NUTRITION_VALUES).map((nv) => nv), '_id', 'name'];


const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Pole Název je povinné';
  }
  return errors;
};

@reduxForm({
    form: 'foodDetail',
    fields: fields,
    validate
  },
  undefined,
)
export default class FoodDetailForm extends React.Component {

  render() {

    const { fields, handleSubmit, submitting, errors, pristine, invalid } = this.props;
    
    const inputs = Object.keys(fields).map((type, i) => {
      if(type === 'name' || type === '_id') return;
      return <PureInput type="number" min="0" step="0.01" label={D_NUTRITION_VALUES[type].label} addonAfter={D_NUTRITION_VALUES[type].unit} field={fields[type]} key={i} />
    }); 

    const errorMessages = Object.keys(errors).map((error) => <li>{errors[error]}</li>)
 
    return (
      <div>
        <Alert bsStyle="warning">Hodnoty se vyplňují v přepočtu na <strong>100g</strong> potraviny</Alert>
        <form onSubmit={handleSubmit}>
          <PureInput label="Název" field={fields.name} />
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