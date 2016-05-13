import React from 'react';
import Helmet from 'react-helmet'
import moment from 'moment'
import { browserHistory } from 'react-router'
import { reduxForm } from 'redux-form'
import { signup } from '../actions/auth'
import UserInfo from './Preferences/UserInfo'

if ( process.env.BROWSER ) var humane = require('../utils/utils').humane;


const validate = (values) => {
  const errors = {};
  if (!values.username) errors.username = 'Uživatelské jméno je povinné'; 
  else if (values.username.length < 3) errors.username = 'Uživatelské jméno musí mít alespoň tři znaky';
  if (!values.email) errors.email = 'E-mail je povinný'; 
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) errors.email = 'E-mail je ve špatném formátu';
  if (!values.password) errors.password = 'Heslo je povinné';

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

@reduxForm({
    form: 'signup',
    fields: ['username', 'password', 'email', 'gender', 'birthday', 'weight', 'height', 'activityFactor'],
    validate
  },
  undefined,
  { dispatchSignup: signup }
)
export default class SignUpForm extends React.Component {

  render() {

    const { fields, handleSubmit, submitting, dispatchSignup } = this.props;
    const { fields: { username, email, password } } = this.props;

    const title = 'Registrace';
    return (
      <div>
        <h1>{title}</h1>
        <Helmet title={title} />
        <form>
          <div className={'form-group ' + (username.touched && username.error && 'has-error')}>
            <label>Uživatelské jméno</label>
            <input type="text" className="form-control" {...username} />
            {username.touched && username.error && <span className="help-block">{username.error}</span>}
          </div>
          <div className={'form-group ' + (email.touched && email.error && 'has-error')}>
            <label>E-mail</label>
            <input type="email" className="form-control" {...email} />
            {email.touched && email.error && <span className="help-block">{email.error}</span>}
          </div>
          <div className={'form-group ' + (password.touched && password.error && 'has-error')}>
            <label>Heslo</label>
            <input type="password" className="form-control" {...password} />
            {password.touched && password.error && <span className="help-block">{password.error}</span>}
          </div>

          <UserInfo fields={fields} />

          <button className="btn btn-success" disabled={submitting}
            onClick={handleSubmit((data) => dispatchSignup(data).then(() => {
              browserHistory.push('/prihlaseni');
              humane.log('Registrace proběhla úspěšně. Nyní se můžete přihlásit.')
            }))}
            > Odeslat
          </button>
        </form>
      </div>
    )
  }
}