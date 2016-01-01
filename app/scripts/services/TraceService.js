/*
 Trace Service
 Responsible for the creation of Traces given an input array of DataSets and a configuration
 */
'use strict';

angular
  .module('eaApp')
  .service('trace', ['$http', 'lodash', 'SessionService', '$rootScope', function ($http, lodash, SessionService, $rootScope) {
  	var util = this;


 	util.makeTraces = function(config) {
 		if (angular.isDefined(config) == false) {
			 config = {axis : {x : "Time", y: "Altitude"}};
		}

  		return util.generateTracesFromDataSet($rootScope.datasets, config);
  	};

  	util.generateTracesFromDataSet = function(datasetArray, config) {
  		var traces = [];	

  		lodash.forEach(datasetArray, function(dataset) { 
  			if (util.isUsed(dataset, config)) {
	  			var trace = {
	  				mode: 'lines+markers',
	  				type: 'scattergl', 
	  				marker : {
	  					symbol : 1, 
	  					color  : "blue",
	  					size  : 7, 
	  					opacity : 1.0
	  				}
	  			};

	  			trace.x = util.getDataArray(dataset, config.axis.x);
	  			trace.y = util.getDataArray(dataset, config.axis.y);
	  			trace.markers
	  			//lodash.forEach(configuration.axis, function(axName) { 
	  			//	trace[axName] = util.getDataArray(dataset, axName);
	  			//});
	  			traces.push(trace);
  			}
  		});

  		return traces;
  	};

  	util.getDataArray = function(dataset, fieldName) {
  		return dataset.data[fieldName].values;
  	}

  	util.isNotUsed = function(dataset, config) {
    	var index = lodash.indexOf(config.excluded, dataset);
    	return index >= 0;
    }

   	util.isUsed = function(dataset, config) {
    	return !util.isNotUsed(dataset, config);
    }

  }])
