/*
Data Utils
*/

'use strict';

angular
  .module('eaApp')
  .service('util', ['$http', 'lodash', function ($http, lodash) {
  	var util = this;

  	// Merges multiple data sets
  	util.extractArray = function(fieldName, unit, dataArray) {
  		var output = [];

  		lodash.forEach(dataArray, function() {
  			// get the data
  			var arrayData = dataset[fieldName].values;

  			// determine the correct unit 
  			if (angular.isUndefined(unit)) {
  				unit = fields.getDefaultUnit(fieldName);
			}
			if (angular.isUndefined(unit)) {
  				unit = dataset[fieldName].unit;
			}
  			
  			// Convert the data to the identified unit
  			arrayData = units.convert(dataset[fieldName], unit);

  			output.push(this);
        });
  	}

  	// Count Rows
  	util.count = function(fieldName, unit, dataArray) {

  	}


  	// A series is the group of data that should be shown in the legend with the lined connected
  	// The series may need to be sorted to connect the lines correctly. 
  	util.generateSeriesData = function(data, groupSettings) {


  	}

  	// Returns the marker arrays {symbol : "", color : "", size: ""}. Each item in the return object
  	// can be undefined, scalar or array. If it is an array then there will be a single value for
  	// each data point in the series data. The series data is assumed to be an array.
  	util.generateMarkerData = function(seriesData, groupSettings) {
  		var fieldNameLineColor = groupSettings.line.color.fieldName; 
  		lodash.forEach(seriesData, function() {




  		}
  	}

  	util.generateLineColorMap = function(seriesData, groupSettings) {
  	
  		var fieldNameLineColor = groupSettings.line.color.fieldName; 
  		var result = util.generateMap(seriesData, fieldNameLineColor, util.generateColor);
  		return result;
  	}

  	util.generateMap(seriesData, fieldName, generateFunction) {
  		var index = 0;

  		var result = {};
  		// If this is a field that is enumerated
  		lodash.forEach(seriesData, function() {
  			var item = seriesData[fieldName];
  			if (angular.isUndefined(result[item])) {
  				result[item] = util.generateFunction(index++);
  			}
  		}

  		return result;
  	}

  	util.generateColor(index) {
  		return 'red';
  	}

  }])