import moment from 'moment'


if ( process.env.BROWSER ) {
  var humane = require('humane-js');
  humane.baseCls = 'humane-libnotify';
  humane.error = humane.spawn({ addnCls: 'humane-libnotify-error' });

  module.exports.humane = humane;
}



export function hexSeconds(timestamp) {
	return Math.floor(timestamp / 1000).toString(16);
}

export function objectIdFromTimestamp(timestamp) {
	return hexSeconds(timestamp) + '0000000000000000';
}

export function timestampFromObjectId(objectId) {
	let date = new Date(parseInt(String(objectId).substring(0, 8), 16) * 1000);
	
	return date.setUTCHours(0,0,0,0);
}

export function countNutrient(value, totalWeight) {
	//value in micrograms to grams
	return (value * totalWeight);
}



export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function isDateStringValid(dateString) {
	return moment(dateString, 'YYYY-MM-DD', true).isValid();
}

export function getTimestampFromParams(params) {
  const dateString = params && params.date ? params.date : null;

  const date = isDateStringValid(dateString) ? moment.utc(dateString).toDate() : new Date();

  return date.setUTCHours(0,0,0,0);
}

export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}