import React from 'react'
import { reduxForm } from 'redux-form'
import moment from 'moment'
import { Row, Col, Button, Panel, Table, Alert } from 'react-bootstrap'
import UserInfo from './UserInfo'
import NutritionValues from './NutritionValues'
import SelectNutritionValue from './SelectNutritionValue'
import PureInput from './../PureInput'

import { calculateRmr, calculateTee, calculateNutritionValue } from '../../utils/preferences'

import { D_NVS } from '../../dictionary'


const validate = values => {
  const errors = {};
  if (!values.gender) errors.gender = 'Pohlaví je povinné';
  if(!values.birthday) errors.birthday = 'Datum narození je povinné';
  if(!values.weight) errors.weight = 'Váha je povinná';
  if(!values.height) errors.height = 'Výška narození je povinná';
  if(!values.activityFactor) errors.activityFactor = 'Úroveň fyzické aktivity je povinná';

  if (!/^(0?[1-9]|[12][0-9]|3[01])(\.|,)(0?[1-9]|1[012])(\.|,)(19|20)\d\d$/i.test(values.birthday) && values.birthday) {
    errors.birthday = 'Datum narození je ve špatném formátu. Správný formát: D.M.YYYY. Např.: 7.10.1990';
  }
  else if(moment(values.birthday, 'DD.MM.YYYY').diff(moment().subtract(1, 'days')) > 0) errors.birthday = 'Datum narození nemůže být dnes ani v budoucnosti';
  
  return errors;
};

const NotSaved = () => {
  return (<Alert bsStyle="warning">Nezapomeňte uložit změny</Alert>);
};

const Calculated = ({preferences}) => {
  const tee = calculateTee(preferences);
  return (
    <div>
      <h3>Spočtené údaje</h3>
      <div className="alert bg-info">
        Klidová míra metabolismu (RMR): <strong>{calculateRmr(preferences)}</strong> kcal/den<br />
        Celkový energetický výdeh (TEE) a doporučený příjem pro udržení váhy: <strong>{tee}</strong> kcal/den<br />
        Pro zhubnutí 0,45kg za týden je doporučeno: <strong>{tee - 500}</strong> kcal/den<br />
        Pro nabrání 0,45kg za týden je doporučeno: <strong>{tee + 500}</strong> kcal/den<br />
      </div>
    </div>
  )
}

@reduxForm({
  form: 'preferences',
  fields: ['_id', 'gender', 'birthday', 'weight', 'height', 'activityFactor', 'nutritionValues[].type', 'nutritionValues[].goal', 'nutritionValues[].auto'],
  validate,
  overwriteOnInitialValuesChange: true
})
export default class PreferencesForm extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
      nvToChoose: null
    };

    this.preferences = {};
  }

  addNutritionValue = (type) => {
    this.props.fields.nutritionValues.addField({ 
      type,
      goal: calculateNutritionValue({type, preferences: this.preferences}),
      auto: true
    });
  };



  render() {

    const {
      fields,
      dirty,
      handleSubmit,
      submitting,
    } = this.props;

    this.preferences = {
      gender: fields.gender.value, 
      birthday: fields.birthday.value, 
      weight: fields.weight.value, 
      height: fields.height.value, 
      activityFactor: fields.activityFactor.value,
    };

    const nutritionValuesArr = fields.nutritionValues.map(nutrient => nutrient.type.value);

    const nutritionValuesToChoose = Object.keys(D_NVS)
      .filter((nutrient) => nutritionValuesArr.indexOf(nutrient) === -1 )
      .map((type, i) => {
        return {value: type, label: D_NVS[type].label}
      });

    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <UserInfo fields={fields} />
          </Col>
          <Col md={6}>
            <Calculated preferences={this.preferences} />
          </Col>
        </Row>
        <NutritionValues nutritionValues={fields.nutritionValues} preferences={this.preferences} />
        <SelectNutritionValue options={nutritionValuesToChoose} addNutritionValue={this.addNutritionValue} />
        {dirty && <NotSaved />}
        <Button type="submit" bsStyle="success" bsSize="large" disabled={submitting}><i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Uložit</Button>
      </form>
    )
  }
}