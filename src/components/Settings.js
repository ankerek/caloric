import React from 'react';
import Helmet from 'react-helmet'
import { connect } from 'react-redux'

class Settings extends React.Component {
	constructor(props) {
    super(props);
  }

  /*
  static fetchData({ store, params, baseUrl }) {
    const date = getDateFromParams(params);
    
    return store.dispatch(fetchMeals(baseUrl, date))
  }
  */

  render() {
    
    return (
      <div>
        <h1>Nastavení</h1>
        <Helmet title="Nastavení"/>
        {this.props.children}
      </div>
    )
  }
}


export default connect()(Settings)