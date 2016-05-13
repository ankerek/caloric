import React from 'react'
import { Panel, Table } from 'react-bootstrap'
import PureInput from './../PureInput'

export default function UserInfo(fields) {
	const { fields: { gender, birthday, weight, height, activityFactor } } = fields;
	return (
		<div>
		<div className={'form-group ' + (gender.error && gender.touched && 'has-error')}>
      <label>Pohlaví</label>
      <div>
        <label className="radio-inline">
          <input type="radio" {...gender} value="male" checked={(gender.value ? gender.value : gender.initialValue) === 'male'}/> Muž
        </label>
        <label className="radio-inline">
          <input type="radio" {...gender} value="female" checked={(gender.value ? gender.value : gender.initialValue) === 'female'}/> Žena
        </label>
      </div>
      {gender.error && gender.touched && <span className="help-block">{gender.error}</span>}
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
    </div>
	)
	
}