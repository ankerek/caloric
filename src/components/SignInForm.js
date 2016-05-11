import React from 'react';
import { reduxForm } from 'redux-form'
import { browserHistory } from 'react-router'
import Helmet from 'react-helmet'
import { signin } from '../actions/auth'


const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Uživatelské jméno je povinné';
  }
  if (!values.password) {
    errors.password = 'Heslo je povinné';
  }
  return errors;
};

@reduxForm({
    form: 'signin',
    fields: ['username', 'password'],
    validate
  },
  undefined,
  { dispatchSignin: signin }
)
export default class SignInForm extends React.Component {

  render() {

    const { fields: { username, password }, handleSubmit, submitting, dispatchSignin } = this.props;
    const title = 'Přihlášení';

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
          <div className={'form-group ' + (password.touched && password.error && 'has-error')}>
            <label>Heslo</label>
            <input type="password" className="form-control" {...password} />
            {password.touched && password.error && <span className="help-block">{password.error}</span>}
          </div>

          <button className="btn btn-success" disabled={submitting}
            onClick={handleSubmit((data) => dispatchSignin(data).then((result) => {
              if(result.status !== 'error') browserHistory.push('/');
            }))}
            > Přihlásit se
          </button>
        </form>
      </div>
    )
  }
}