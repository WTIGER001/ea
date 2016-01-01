/*
Extension Manager
------------------------------------
The extension manager supports the dynamic addition of capablities to the system
without incuring a dependancy or requiring a recompile. This capablity is limited
to only bare javascript and a few utilities. 

Extensions are used to provide the rules that are used for coding, filtering and 
dynamically creating new columns
*/
'use strict';

var app = angular.module('eaApp');

app.service('ExtensionManager', ['$http', 'lodash', function ($http, lodash) {
	var extensionPoints = [
		'MarkerSymbolRule'
	]

	var svc = this;

	var globalExtensions  = {};		// Represents all the extensions that are globally avaialable
	var userExtensions    = {};		// Extensions that this user has submitted
	var projectExtensions = {};		// Extensions that are in this project


	// Adds an extension to the extension manager
	svc.add = function(extension) {
		var eid = extension.extensionPointId;
		var extensionCollection = globalExtensions[eid];
		if (angular.isUndefined(extensionCollection)) {
			extensionCollection = {};
			globalExtensions[eid] = extensionCollection;
		}

		extensionCollection[extension.id] = extension;
	}

	// Removes an extension from the extension manager
	svc.remove = function(extensionId, extensionUID) {
		var extensionCollection = globalExtensions[extensionId];
		if (!angular.isUndefined(extensionCollection)) {
			delete extensionCollection[extensionUID];
		}
	}

	// Gets all extensions of a given extension id
	svc.getAll = function(extensionId) {
		var extensionCollection = globalExtensions[extensionId];
		if (angular.isUndefined(extensionCollection)) {
			return [];
		}
		return lodash.values(extensionCollection);
	}

	// Get an extension by the extension id and uid
	svc.get = function(extensionId, extensionUID) {
		var extensionCollection = globalExtensions[extensionId];
		if (angular.isUndefined(extensionCollection)) {
			return null;
		}

		return extensionCollection[extensionUID];
	}

	// Initialize
	var ext1 = {
		name: "Symbol By Field", 
		id: "ea.standard.symbol_by_field", 
		extensionPointId: "MarkerSymbolRule",
		type: "global",
		params: [
			{name: "Field", id:"field", type : "field", desc: "Field to examine, should be a string" }
		],
		prepare: function(datasets, extensiondata) {

		}, 
		calc: function(dataset, params, extensiondata) {
			// Get the field name
			var fieldName = params["field"];
			// Get the data array for this field
			var array = dataset.data[fieldName].values;
			// loop through each value in the array and put in a value
			// for now it is just a square
			var result = [];
			for (var i=0;i<array.length; i++) {
				var value = array[i];
				var symbolSetForField = extensiondata.data[fieldName];
				if (angular.isUndefined(symbolSetForField)) {
					symbolSetForField = {};
					extensiondata.data[fieldName] = symbolSetForField;
				}
				var item = symbolSetForField[value];
				if (angular.isUndefined(item)) {
					// Get the next value
					extensiondata.symbolIndex++;
					if (extensiondata.symbolIndex > extensiondata.maxIndex) {
						extensiondata.symbolIndex = extensiondata.maxIndex;
					}
					item = extensiondata.symbols[extensiondata.symbolIndex];
					symbolSetForField[value] = item;
				}

				result.push(item);
			}
			return result;
		}, 
		extensiondata: {
			symbolIndex : -1,
			maxIndex : 9,
			symbols : ['dot', 'cross', 'diamond', 'square', 'triangle-down', 'triangle-left', 'triangle-right', 'triangle-up', 'x'],
			data : { }
		}
	};
	svc.add(ext1)
}]);