import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Immutable from 'immutable'
import Info from './Info';

class Information extends React.Component {
	constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {

    const {nutritionValues} = this.props;
    console.log('Information');

    const items = nutritionValues.map( (item, i) => {
      return (
        <Info item={item} key={i} />
      );
    });

    return (
      <section>
      	<h2>Info</h2>
        {items}
      </section>
    )
  }
}

Information.propTypes = {
  nutritionValues: PropTypes.instanceOf(Immutable.List).isRequired
}

export default Information