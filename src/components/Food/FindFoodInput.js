import React, {PropTypes} from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { debounce } from '../../utils/utils'



export default class FindFoodInput extends React.Component {

  static propTypes = {
    findFoodList: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      error: false
    };

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.debouncedFind = debounce(this.props.findFoodList, 300);
  }

  onChange = (e) => {
    const value = e.target.value;
    const error = value.length < 3 && value.length !== 0;
    this.setState({
      name: value,
      error
    });

    if(!error) this.debouncedFind(value);
  };
  
  render() {
    const error = this.state.error;
    return (
      <div>
        <div className={'form-group ' + (error && 'has-error')}>
          <label>Vyhledat potraviny</label>
          <input type="text" className="form-control" value={this.state.name} onChange={this.onChange} />
          {error && <span className="help-block">Zadejte alespoň tři znaky</span>}
        </div>
      </div>
    )
  }

}