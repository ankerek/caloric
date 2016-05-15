import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Link } from 'react-router'
import Immutable from 'immutable'
import { getTimestampFromParams } from '../utils/utils'
import Info from './Info';

class Information extends React.Component {
	constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { nutritionValues, params } = this.props;

    const items = nutritionValues.map( (item, i) => {
      return (
        <Info item={item} key={i} />
      );
    });

    const oldDate = getTimestampFromParams(params) < new Date().setUTCHours(0,0,0,0);

    const preferencesPath = '/predvolby/'+(oldDate ? params.date : '');
    let preferencesInfo = <p>Pro tento den nemáte nastavené žádné nutriční hodnoty ke sledování. Můžete si je nastavit v <Link to={preferencesPath}>předvolbách</Link>.</p>;
    if(items.size > 0) {
      preferencesInfo = oldDate ? <p>Upravit nastavení sledování nutričních hodnot pro tento den v <Link to={preferencesPath}>předvolbách</Link>.</p> : <p>Upravit nastavení sledování nutričních hodnot v <Link to={preferencesPath}>předvolbách</Link>.</p>
    }

    return (
      <section>
      	<h2>Nutriční hodnoty</h2>
        { preferencesInfo }

        {items}
      </section>
    )
  }
}

Information.propTypes = {
  nutritionValues: PropTypes.instanceOf(Immutable.List).isRequired
}

export default Information