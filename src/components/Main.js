import React from 'react';
import { connect } from 'react-redux'
import { fetchUser } from '../actions/auth'
import { logoutAndRedirect } from '../utils/auth'
import { closeNotification } from '../actions/notification'
import Header from './Header'
import Notification from './Notification'


@connect(
  state => ({
    user: state.auth.get('user'),
    notification: state.notification
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

  handleCloseNotification = () => {
    this.props.dispatch(closeNotification());
  };

  render() {
    const { user, notification } = this.props;

    return (
      <div>
        <Header user={user} handleLogout={this.handleLogout} />
        <div className="container">
          {notification.get('message') && <Notification notification={notification} closeNotification={this.handleCloseNotification} />}
          {this.props.children}
        </div>
      </div>
    )
  }
}
