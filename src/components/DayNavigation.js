import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { browserHistory } from 'react-router'
import cs from 'moment/locale/cs' // eslint-disable-line no-unused-vars
import moment from 'moment'
import DatePicker from 'react-date-picker'
import { LinkContainer } from 'react-router-bootstrap'
import { Pager, PageItem } from 'react-bootstrap'

export default class DayNavigation extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
      showCal: false
    };

    this.pageClick = this.pageClick.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  dateOnChange (dateString) {
    browserHistory.push('/jidelnicek/' + dateString);
  }

  componentWillMount () {
    if(process.env.BROWSER) window.addEventListener('click', this.pageClick, false);
  }
  componentWillUnmount () {
    window.removeEventListener('click', this.pageClick, false);
  }

  pageClick() {
    if(this.mouseOnCal) return;

    this.setState({
      showCal: false
    });
  }

  getPrevNextDay = (type) => {
    const {timestamp} = this.props;
    const next = new Date(timestamp);
    next.setHours(0,0,0,0);
    next.setDate(next.getDate() + (type === 'next' ? 1 : -1));
    return '/jidelnicek/' + moment(next).format('YYYY-MM-DD');
  };

  onMouseEnter = () => {
    this.mouseOnCal = true;
  };

  onMouseLeave = () => {
    this.mouseOnCal = false;
  };

  dayOnClick = () => {
    this.setState({
      showCal: !this.state.showCal
    });
  };


  render() {
    
    const {timestamp} = this.props;
    const today = moment(timestamp).format('dddd, D. MMMM YYYY');

    return (
      <div className="day-navigation">
        <Pager  
            onMouseEnter={this.onMouseEnter} 
            onMouseLeave={this.onMouseLeave}>
          <LinkContainer to={this.getPrevNextDay('prev')}>
            <PageItem>&larr; Předcházející den</PageItem>
          </LinkContainer>
          {' '} <PageItem onClick={this.dayOnClick} title="Zobrazit kalendář"><strong>{today}</strong></PageItem>{' '} 
          <LinkContainer to={this.getPrevNextDay('next')}>
            <PageItem>Následující den &rarr;</PageItem>
          </LinkContainer>
        </Pager>
        
      	{this.state.showCal && <DatePicker
          date={timestamp}
          onChange={this.dateOnChange}
          hideFooter={true}
          locale="cs"
          onMouseEnter={this.onMouseEnter} 
          onMouseLeave={this.onMouseLeave}
        /> }
      </div>
    )
  }
}
