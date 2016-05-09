import React, {PropTypes} from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Autosuggest from 'react-autosuggest'
import 'isomorphic-fetch'
import {removeDiacritics} from '../functions'
import { debounce } from '../utils/utils'


class FindFoodInput extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      food: null,
      value: '',
      suggestions: [],
      isLoading: false
    };

    this.cache = {
      [this.state.value]: this.state.suggestions
    };

    this.debouncedLoadSuggestions = debounce(this.loadSuggestions, 300);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  loadSuggestions(value) {
    

    const valueKey = removeDiacritics(value.toLowerCase());


    if (this.cache[valueKey]) {
      this.setState({
        suggestions: this.cache[valueKey]
      });
    } else {
    	this.setState({
	      isLoading: true
	    });

	    fetch('/api/food/' + valueKey)
		    .then((response) => {
	        const json = response.json();
	        if (response.status >= 200 && response.status < 300) return json;
	        else return json.then(Promise.reject.bind(Promise));
	      })
		    .then(result => {
		    	if(result.status !== 'error') {

		    		if (value === this.state.value) {
		          this.cache[valueKey] = result;

		          this.setState({
		            isLoading: false,
		            suggestions: result
		          });
		        } else {
		        	this.setState({
			          isLoading: false
			        });
		        }

			    	
			    }
		    })
		    .catch(ex => console.log('parsing failed', ex));
    }

    
  }

	renderSuggestion(suggestion) {
	  return (
	    <span>
	      {suggestion.name}
	    </span>
	  );
	}

  getSuggestionValue = (suggestion) => {
  	this.setState({
  		food: suggestion
  	});  	
  	this.props.onUpdate(suggestion);

	  return suggestion.name;
	};

	reset = () => {
    this.setState({
      value: '',
      food: null
    });
  };

	// onSuggestionSelected(event, { suggestionValue }) {
	// 	console.log('dsdsds');
 //    this.loadSuggestions(suggestionValue);
 //  }

	onSuggestionsUpdateRequested = ({ value, reason }) => {
    if (reason === 'type') {
      this.debouncedLoadSuggestions(value);
    } 
  };

	onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

	onInput = () => {
		this.setState({
			food: null
		});
		this.props.onUpdate(null);
	};

	foodValidation() {
		if(this.state.value.length > 0 && !this.state.food) return 'has-error';
		else return '';
	}
	
  render() {
  	console.log('FindFoodInput');
  	const { value, suggestions } = this.state;
  	const inputProps = {
      className: 'form-control',
      placeholder: 'Vyhledat jídlo',
      value,
      onInput: this.onInput,
      onChange: this.onChange
    };

    return (
			<div className={this.foodValidation()} >
	      <Autosuggest
	      	suggestions={suggestions}
	      	onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
					getSuggestionValue={this.getSuggestionValue}
					renderSuggestion={this.renderSuggestion}
				 	inputProps={inputProps} />
		 	</div>
    )
  }
}

FindFoodInput.propTypes = {
  onUpdate: PropTypes.func.isRequired
}

export default FindFoodInput