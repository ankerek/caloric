import React, { PropTypes } from 'react'
import moment from 'moment'
import {makeWidthFlexible, XYPlot, XAxis, YAxis, LineSeries, VerticalBarSeries, Crosshair} from 'react-vis'
import { D_NVS } from '../../dictionary'

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

export default class NVGraph extends React.Component {

  static propTypes = {
    data: PropTypes.shape({
      goals: PropTypes.array.isRequired,
      values: PropTypes.array.isRequired,
      xLabelValues: PropTypes.array.isRequired
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      type: 'kcal',
      crosshairValues: []
    };
    this._crosshairValues = [];

    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onNearestXs = [
      this._onNearestX.bind(this, 0),
      this._onNearestX.bind(this, 1)
    ];
  }

  /**
   * Event handler for onNearestX.
   * @param {number} seriesIndex Index of the series.
   * @param {Object} value Selected value.
   * @private
   */
  _onNearestX(seriesIndex, value) {
    this._crosshairValues = this._crosshairValues.concat();
    this._crosshairValues[seriesIndex] = value;
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
      value: moment(values[1].x).format('D.M.Y')
    };
  }

  _formatCrosshairItems(values) {
    return values.map((v, i) => {
      return {
        title: (i === 0) ? 'Hodnota' : 'Cíl',
        value: v.y
      };
    });
  }

  render() {
    const { data: { goals, values, xLabelValues }, type } = this.props;

    return (
      <div>
        <FlexibleXYPlot
          xType="time"
          height={500}
          margin={{left: 50, right: 10, top: 20, bottom: 50}}
          onMouseLeave={this._onMouseLeave}
          >
          
          <VerticalBarSeries
            onNearestX={this._onNearestXs[0]}
            data={values} />
          
          
          <XAxis
            labelFormat={v => moment(v).format('D.M.')}
            labelValues={xLabelValues}
           />
          <LineSeries
            onNearestX={this._onNearestXs[1]}
            data={goals}
            color="orange" />
          <YAxis
            title={D_NVS[type].unit}
            labelFormat={v => v}
           />
          <Crosshair 
            itemsFormat={this._formatCrosshairItems}
            titleFormat={this._formatCrosshairTitle}
            values={this.state.crosshairValues} />
        </FlexibleXYPlot>
      </div>
    )
  }
}
