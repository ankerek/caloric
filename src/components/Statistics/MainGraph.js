import React, { PropTypes } from 'react'
import moment from 'moment'
import { Map } from 'immutable'
import { makeWidthFlexible, XYPlot, XAxis, YAxis, LineSeries, VerticalBarSeries, Crosshair } from 'react-vis'

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

export default class MainGraph extends React.Component {

  static propTypes = {
    goals: PropTypes.instanceOf(Map)
  };

  constructor(props) {
    super(props);
    this.state = {
      type: 'kcal',
      crosshairValues: []
    };
    this._crosshairValues = [];

    this._onMouseLeave = this._onMouseLeave.bind(this);
  }

  /**
   * Event handler for onNearestX.
   * @param {number} seriesIndex Index of the series.
   * @param {Object} value Selected value.
   * @private
   */
  _onNearestX = (seriesIndex, value) => {
    this._crosshairValues = this._crosshairValues.concat();
    this._crosshairValues[seriesIndex] = {
      x: value.x,
      y: value.y0 ? value.y - value.y0 : value.y
    };
    this.setState({crosshairValues: this._crosshairValues});
  }

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _onMouseLeave() {
    this._crosshairValues = [];
    this.setState({crosshairValues: this._crosshairValues});
  }

  _formatCrosshairTitle(values) {
    return {
      title: 'Datum',
      value: moment(values[0].x).format('D.M.Y')
    };
  }

  _formatCrosshairItems(values) {
    return values.map((v, i) => {
      let title = 'Cíl';
      switch(i) {
        case 0: title = 'Sacharidy';
        break;
        case 1: title = 'Tuky';
        break;
        case 2: title = 'Bílkoviny';
        break;
      }
      return {
        title,
        value: v.y
      };
    });
  }

  render() {
    const { data: { goals, proteins, carbs, fats, xLabelValues } } = this.props;

    return (
      <div className="graph">
        <FlexibleXYPlot
          stackBy="y"
          xType="time"
          height={500}
          margin={{left: 50, right: 10, top: 20, bottom: 50}}
          onMouseLeave={this._onMouseLeave}
          >

          <VerticalBarSeries
            onNearestX={this._onNearestX.bind(this, 0)}
            data={carbs}
            color="#5bc0de" />
          <VerticalBarSeries
            onNearestX={this._onNearestX.bind(this, 1)}
            data={fats}
            color="#d9534f" />
          <VerticalBarSeries
            onNearestX={this._onNearestX.bind(this, 2)}
            data={proteins}
            color="#5cb85c" />

            
          <XAxis
            labelFormat={v => moment(v).format('D.M.')}
            labelValues={xLabelValues}
           />
        
          <LineSeries
            onNearestX={this._onNearestX.bind(this, 3)}
            data={goals} />
          <YAxis
            title="kcal"
            labelFormat={v => v}
           />
          
          <Crosshair 
            itemsFormat={this._formatCrosshairItems}
            titleFormat={this._formatCrosshairTitle}
            values={this.state.crosshairValues} />
        </FlexibleXYPlot>
        <div className="graph-legend">
          <div className="legend-item">
            <div className="line orange"></div>
            Cíl kcal
          </div>
          <div className="legend-item">
            <div className="square blue"></div>
            Sacharidy
          </div>
          <div className="legend-item">
            <div className="square red"></div>
            Tuky
          </div>
          <div className="legend-item">
            <div className="square green"></div>
            Bílkoviny
          </div>
        </div>
      </div>
    )
  }
}
