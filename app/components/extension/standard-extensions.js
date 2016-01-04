/* standard-extensions.js */
(function() {

	var symbol_by_field =  {
		name: "Symbol By Field", 
		id: "ea.standard.symbol_by_field", 
		extensionPointId: "MarkerSymbolRule",
		type: "global",
		paramDefs: [
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

	var relative_size_by_field = {
			name: "Relative Size By Field", 
			id: "ea.standard.relative_size_by_field", 
			extensionPointId: "MarkerSizeRule",
			type: "global",
			paramDefs: [
				{name: "Field", id:"field", type : "field", desc: "Field to examine, should be a number" }, 
				{name: "Min Size", id:"min", type : "number", desc: "Minimum size" }, 
				{name: "Maz Size", id:"max", type : "number", desc: "Maximum size" }
			],
			prepare: function(datasets, extensiondata) {

			}, 
			calc: function(dataset, params, extensiondata) {
				// Get the field name
				var fieldName = params["field"];
				var min = params['min'];
				var max = params['max'];

				// Get the data array for this field
				var array = dataset.data[fieldName].values;
					
				// Calculate the min and max for this array
				var realMin = lodash.min(array);
				var realMax = lodash.max(array);

				// loop through each value in the array and put in a value
				// for now it is just a square
				var factor = (realMax - realMin) / (max - min);

				var result = [];
				for (var i=0;i<array.length; i++) {
					var value = array[i];
					var offset = value - realMin;
					var size = offset * factor + min;
					result.push(size);
				}
				return result;
			}, 
			extensiondata: {

			}
	};

		// Initialize
	var absolute_size_by_field = {
			name: "Absolute Size By Field", 
			id: "ea.standard.absolute_size_by_field", 
			extensionPointId: "MarkerSizeRule",
			type: "global",
			paramDefs: [
				{name: "Field", id:"field", type : "field", desc: "Field to examine, should be a number" }, 
				{name: "Min Size", id:"min", type : "number", desc: "Minimum size", min:"0", step:"0.1"}, 
				{name: "Max Size", id:"max", type : "number", desc: "Maximum size", min:"1", step:"0.1"}
			],
			prepare: function(datasets, params, extensiondata) {
				var mins = [];
				var maxs = [];
				var fieldName = params["field"];

				for (var i=0; i<datasets.length; i++) {
					var array = dataset.data[fieldName].values;
					var realMin = lodash.min(array);
					var realMax = lodash.max(array);

					mins.push(realMin);
					maxs.push(realMax);
				}

				extensiondata.realMin = lodash.min(mins);
				extensiondata.realMax = lodash.min(maxs);
			}, 
			calc: function(dataset, params, extensiondata) {
				// Get the field name
				var fieldName = params["field"];
				var min = params['min'];
				var max = params['max'];

				// Get the data array for this field
				var array = dataset.data[fieldName].values;
					
				// Calculate the min and max for this array
				var realMin = extensiondata.realMin;
				var realMax = extensiondata.realMax;

				// loop through each value in the array and put in a value
				// for now it is just a square
				var factor = (realMax - realMin) / (max - min);

				var result = [];
				for (var i=0;i<array.length; i++) {
					var value = array[i];
					var offset = value - realMin;
					var size = offset * factor + min;
					result.push(size);
				}
				return result;
			}, 
			extensiondata: {

			}
	};

	var indexgenerator = {
			name: "Index", 
			id: "ea.standard.column.indexgenerator", 
			desc: "Generates the index number (starting at 0), called 'index'",
			extensionPointId: "ColumnGenerator",
			type: "global",
			runalways : true,
			paramDefs: [
				
			],
			prepare: function(datasets, params, extensiondata) {
				
			}, 
			calc: function(dataset, params, extensiondata) {
				
				// Get the data array for this field
				var fieldName = lodash.keys(dataset.data)[0];
				var array = dataset.data[fieldName].values;

				var result = [];
				for (var i=0;i<array.length; i++) {
					result.push(i);
				}

				dataset.data['index'] = result;
				dataset.fields.push('index');

			}, 
			extensiondata: {

			}
	};


	function addItems(ExtensionManager) {
		ExtensionManager.add(symbol_by_field);
		ExtensionManager.add(relative_size_by_field);
		ExtensionManager.add(absolute_size_by_field);
		ExtensionManager.add(indexgenerator);
	}

	// Call angular to add the data
	angular.module('eaApp').run(['ExtensionManager', addItems]);

})();