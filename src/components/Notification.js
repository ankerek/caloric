import React from 'react'
import { Alert } from 'react-bootstrap'
import { closeNotification } from '../actions/notification'



export default class Notification extends React.Component {
	constructor(props) {
    super(props);

    //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }



  render() {
    const { notification, closeNotification } = this.props;
    console.log('notification');

    setTimeout(() => this.props.closeNotification(), 5000);

    return (
      <Alert bsStyle="danger" onDismiss={closeNotification}>
        {notification.get('message')}
      </Alert>
    )
  }
}
