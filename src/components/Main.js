import React from 'react';
import { connect } from 'react-redux'
import { fetchUser } from '../actions/auth'
import { logoutAndRedirect } from '../utils/auth'
import Header from './Header'


@connect(
  state => ({
    user: state.auth.get('user')
  })
)
export default class Main extends React.Component {
	constructor(props) {
    super(props);
  }

  static fetchData({ store, baseUrl }) {    
    return store.dispatch(fetchUser({baseUrl}))
  }

  handleLogout = (e) => {
    e.preventDefault();
    logoutAndRedirect(this.props.dispatch);
  };

  render() {
    const { user } = this.props;

    return (
      <div>
        <Header user={user} handleLogout={this.handleLogout} />
        <div className="container">
          {this.props.children}
        </div>
      </div>
    )
  }
}
