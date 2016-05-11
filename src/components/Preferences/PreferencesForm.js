import React from 'react'
import { reduxForm } from 'redux-form'
import moment from 'moment'
import { Row, Col, Button, Panel, Table, Alert } from 'react-bootstrap'
import NutritionValues from './NutritionValues'
import SelectNutritionValue from './SelectNutritionValue'
import PureInput from './../PureInput'

import { calculateNutritionValue } from '../../utils/preferences'

import { D_NUTRITION_VALUES } from '../../dictionary'


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
  else if(moment(values.birthday, 'DD-MM-YYYY').diff(moment()) > 0) errors.birthday = 'Datum narození nemůže být v budoucnosti';
  
  return errors;
};

const NotSaved = () => {
  return (<Alert bsStyle="warning">Nezapomeňte uložit změny</Alert>);
};

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
      fields: { gender, birthday, weight, height, activityFactor, nutritionValues },
      //pristine,
      dirty,
      handleSubmit,
      //resetForm,
      submitting,
      Calculated
    } = this.props;

    this.preferences = {
      gender: gender.value, 
      birthday: birthday.value, 
      weight: weight.value, 
      height: height.value, 
      activityFactor: activityFactor.value,
    };

    const nutritionValuesArr = nutritionValues.map(nutrient => nutrient.type.value);

    // const nutritionValuesToChoose = Object.keys(D_NUTRITION_VALUES)
    //   .filter((nutrient) => nutritionValuesArr.indexOf(nutrient) === -1 )
    //   .map((type, i) => (<option value={type} key={i}>{D_NUTRITION_VALUES[type].label}</option>));

    const nutritionValuesToChoose = Object.keys(D_NUTRITION_VALUES)
      .filter((nutrient) => nutritionValuesArr.indexOf(nutrient) === -1 )
      .map((type, i) => {
        return {value: type, label: D_NUTRITION_VALUES[type].label}
      });

    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <div className="form-group">
              <label>Pohlaví</label>
              <div>
                <label className="radio-inline">
                  <input type="radio" {...gender} value="male" checked={(gender.value ? gender.value : gender.initialValue) === 'male'}/> Muž
                </label>
                <label className="radio-inline">
                  <input type="radio" {...gender} value="female" checked={(gender.value ? gender.value : gender.initialValue) === 'female'}/> Žena
                </label>
              </div>
            </div>
            <PureInput type="text" label="Datum narození" field={birthday} />
            <PureInput type="number" label="Váha" addonAfter="kg" field={weight} />
            <PureInput type="number" label="Výška" addonAfter="cm" field={height} />
            <div className={'form-group ' + (activityFactor.error && activityFactor.touched && 'has-error')}>
              <label>Úroveň fyzické aktivity</label>
              <select className="form-control"
                {...activityFactor}
                value={activityFactor.value || ''}>
                <option></option>
                <option value="1.2">Sedavá</option>
                <option value="1.375">Mírná</option>
                <option value="1.55">Střední</option>
                <option value="1.7">Těžká</option>
                <option value="1.9">Extrémní</option>
              </select>
              {activityFactor.error && activityFactor.touched && <span className="help-block">{activityFactor.error}</span>}
            </div>
            <Panel collapsible header="Zobrazit informace o fyzických aktivitách">
              <Table responsive>
                <thead>
                  <tr>
                    <th>Název</th>
                    <th>Popis</th>
                    <th>Koeficient</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sedavá</td>
                    <td>Skoro žádné pravidelné cvičení.</td>
                    <td>1,2</td>
                  </tr>
                  <tr>
                    <td>Mírná</td>
                    <td>Intenzivní cvičení po dobu 20 minut jeden až tři dny týdně (běhání, jízda na kole, basketbal, plavání apod.) nebo zaměstnání při kterém se často chodí po dlouhou dobu.</td>
                    <td>1,375</td>
                  </tr>
                  <tr>
                    <td>Střední</td>
                    <td>Intenzivní cvičení 30 až 60 minut tři až čtyři dny týdně (běhání, jízda na kole, basketbal, plavání apod.).</td>
                    <td>1,55</td>
                  </tr>
                  <tr>
                    <td>Těžká</td>
                    <td>Intenzivní cvičení po dobu 60 minut a více pět až sedm dní v týdnu nebo namáhavé zaměstnání (práce na stavbě, farmaření apod.).</td>
                    <td>1,7</td>
                  </tr>
                  <tr>
                    <td>Extrémní</td>
                    <td>Sportovci s několika tréninky denně nebo velmi náročné zaměstnání (práce v dolech, dlouhé hodiny u montážní linky apod.).</td>
                    <td>1,9</td>
                  </tr>
                </tbody>                
              </Table>
            </Panel>
            
            
          </Col>
          <Col md={6}>
            <h3>Doporučené hodnoty na den</h3>
            <Calculated />
          </Col>
        </Row>
        <NutritionValues nutritionValues={nutritionValues} preferences={this.preferences} />
        <SelectNutritionValue options={nutritionValuesToChoose} addNutritionValue={this.addNutritionValue} />
        {dirty && <NotSaved />}
        <Button type="submit" bsStyle="success" bsSize="large" disabled={submitting}><i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Uložit</Button>
      </form>
    )
  }
}