import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {D_NVS} from '../dictionary'
import {ProgressBar} from 'react-bootstrap'

export default class Info extends React.Component {
	constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    this.state = {
      type: 'warning'
    }
  }

  render() {

    const { item } = this.props;
    const baseItem = D_NVS[item.get('type')];

    const value = Math.round(item.get('value') / 1000000);
    const percents = Math.round((value/item.get('goal'))*100);
    //console.log('renderInfo' + item.get('type'));

    let ttype = 'warning';
    if(percents > 60) ttype = 'info';
    if(percents > 90) ttype = 'success';
    if(percents > 110) ttype = 'danger';
    
    const progress = item.has('goal') ? (<ProgressBar bsStyle={ttype} now={percents} label={`${percents}%`} />) : '';

    return (
      <div>
        <div>{baseItem.label}: {item.has('goal') ? `${value}/${item.get('goal')}` : value} {baseItem.unit} </div>
        {progress}
      </div>
    )
  }
}
