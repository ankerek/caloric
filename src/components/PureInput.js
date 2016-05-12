import React, { PropTypes } from 'react'

class PureInput extends React.Component {
	static propTypes = {
	  field: PropTypes.object.isRequired
	};

  shouldComponentUpdate(nextProps) {
    return this.props.field !== nextProps.field
  }

  render() {
    const { field, label, addonAfter, ...rest } = this.props;
    
    return (
    	<div className={'form-group ' + (field.error && field.touched && 'has-error')}>
	  		{label && <label>{label}</label>}
	  		<div className={addonAfter && 'input-group'}>
	    		<input className="form-control" {...field} {...rest} />
	    		{addonAfter && <div className="input-group-addon">{addonAfter}</div>}
    		</div>
	    	{field.error && field.touched && <span className="help-block">{field.error}</span>}
    	</div>
    )
  }
}

export default PureInput