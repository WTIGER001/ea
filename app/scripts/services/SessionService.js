/*
Session Service
--------------------------------------------
The session service stores the session data for the current user. This includes
the datasets that have been uploaded.
*/
'use strict';

angular
  .module('eaApp')
  .service('SessionService', ['$http', 'lodash' ,'Papa', '$rootScope', function ($http, lodash, Papa, $rootScope) {

  var svc = this;
  $rootScope.datasets = [];

  // Add one or more datasets
  svc.add = function(datasets) {
  	svc.data.concat(datasets);
  };

  // Remove one or more datasets
  svc.remove = function(datasets) {
  	if (lodash.isArray(datasets)) {
	  	forEach(datasets, function(d) {
	  		lodash.without(svc.data, d);
	  	})
	 } else {
	 	lodash.without(svc.data, datasets);
	 }
  }

  svc.loadCsv = function(files) {
    var newdata = [];
    angular.forEach(files, function(file) {
      console.log("Working on : " + file.name);
     
      // Parse the CSV
      Papa.parse(file, {
          header: false,
          dynamicTyping: true,
          complete: function(results) {
            
            var dataset = {
                "name" : file.name,
                "source" : file.name
            };

            var byCol = {};
            var colCount = results.data[0].length;
            var rowCount = results.data.length-1;
            // rowCount = rowCount > 10 ? 10 : rowCount;

            // Figure out the header
            var data = lodash.drop(results.data, 1);
            var header = lodash.take(results.data)[0];
            var headerNames = [];
            var units = [];
            for (var i=0; i<header.length; i++) {
              var start = header[i].indexOf("(");
              var end = header[i].indexOf(")");
              headerNames.push(header[i]);
              units.push("");
              if (start > 0 && end > start) {
                headerNames[i] = header[i].substring(0, start);
                units[i] = header[i].substring(start+1, end);
              }
            }

            // Build the columns
            var cols = [];
            for (var j=0;j<colCount; j++) {
              cols.push([])
              for (var i=0; i<rowCount; i++) {
                cols[j].push(data[i][j]);
              }
            }

            // Build the data object
            for (var j=0;j<colCount; j++) {
              var column = {
                  "unit-type" : "",
                  "unit" : units[j],
                  "type": "source", 
                  "values" : cols[j]
              }
              byCol[headerNames[j]] = column;
            }

            dataset.data = byCol;
            dataset.rows = data;
            // dataset.rows = lodash.take(data, 10);
            dataset.fields = headerNames;
            dataset.units = units;
           
            $rootScope.datasets.push(dataset);
            $rootScope.watchMe = {};

            console.log('Added to datasets: ' + dataset.name);
          }, 
          error: function(results) {
            console.log(results);
            console.log("ERROR");
          }
      });

    })
  }

}])