import React from 'react';
import Helmet from 'react-helmet'
import { reduxForm } from 'redux-form'
import { signup } from '../actions/auth'

if ( process.env.BROWSER ) var humane = require('../utils/utils').humane;


const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Uživatelské jméno je povinné';
  } else if (values.username.length < 3) errors.username = 'Uživatelské jméno musí mít alespoň tři znaky';
  if (!values.email) {
    errors.email = 'E-mail je povinný';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'E-mail je ve špatném formátu';
  }
  if (!values.password) {
    errors.password = 'Heslo je povinné';
  }
  return errors;
};

@reduxForm({
    form: 'signup',
    fields: ['username', 'password', 'email'],
    validate
  },
  undefined,
  { dispatchSignup: signup }
)
export default class SignUpForm extends React.Component {

  render() {

    const { fields: { username, email, password }, handleSubmit, submitting, dispatchSignup } = this.props;
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

          <button className="btn btn-success" disabled={submitting}
            onClick={handleSubmit((data) => dispatchSignup(data).then(()=>humane.log('Registrace proběhla úspěšně')))}
            > Odeslat
          </button>
        </form>
      </div>
    )
  }
}