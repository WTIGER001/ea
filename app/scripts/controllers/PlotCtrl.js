var app = angular.module('eaApp');
 
app.controller('PlotCtrl', ['$scope', 'lodash', '$rootScope', 'trace', '$uibModal', function ($scope, lodash, $rootScope, trace, $uibModal) {
    $scope.data = [];
    $scope.traces = [];     
    $scope.layout = {autosize: true, height: 600, width: 1000, margin: {autoexpand: true}};
    $scope.options = {showlink: false, displaylogo: false, displayModeBar: true, scrollZoom: true};
    $scope.config = {
    	axis : {x : "Time", y: "Altitude"}, 
    	excluded: []
    };
    $scope.axisName = ['']; // Hack, gets around the scoping issues with 

    $scope.fonts = [
    		'',
    		'Arial, sans-serif' ,
    	 	'Balto, sans-serif' ,
    	 	'Courier New, monospace' ,
    	 	'Droid Sans, sans-serif' , 
    	 	'Droid Serif, serif' , 
    	 	'Droid Sans Mono, sans-serif', 
    	 	'Georgia, serif' , 
    	 	'Gravitas One, cursive' , 
    	 	'Old Standard TT, serif' , 
    	 	'Open Sans, sans-serif' , 
    	 	'PT Sans Narrow, sans-serif' , 
    	 	'Raleway, sans-serif' , 
    	 	'Times New Roman, Times, serif'];

    $scope.refresh = function () {
        console.log( "Refreshing Local Plot");
        $scope.datasetsAvailable = $scope.areDatasetsAvailable();
        $scope.data = trace.makeTraces($scope.config);          
        $scope.traces = $scope.data;
        console.log( $scope.data.length  + " Traces Now");

        var columns = [];
        angular.forEach($scope.datasets, function(dataset) {
            columns = lodash.union(columns, dataset.fields);
        })
        $scope.columns = columns;
    }

    $scope.setXAxis = function(axis) {
    	$scope.config.axis.x = axis;
    	$scope.refresh();
    }

    $scope.setYAxis = function(axis) {
    	$scope.config.axis.y = axis;
    	$scope.refresh();
    }

    $scope.toggleDataset = function(dataset) {
    	var index = lodash.indexOf($scope.config.excluded, dataset);
    	if (index >=0) {
    		$scope.config.excluded.splice(index, 1);
    	} else {
    		$scope.config.excluded.push(dataset);
    	}
    	$scope.refresh();
    }

    $scope.isNotUsed = function(dataset) {
    	var index = lodash.indexOf($scope.config.excluded, dataset);
    	return index >= 0;
    }

    $scope.isUsed = function(dataset) {
    	return !$scope.isNotUsed(dataset);
    }

    $scope.areDatasetsAvailable = function() {
    	if ($scope.datasets.length == 0) {
    		return false;
    	}
    	if ($scope.datasets.length <= $scope.config.excluded.length) {
    		return false;
    	}
    	return true;
    }
    $scope.datasetsAvailable = $scope.areDatasetsAvailable();

    $rootScope.$watch('watchMe', function() {
        console.log( "Plot data has changed" );
        $scope.refresh();
    })

    $scope.getGd = function() {
    	var element = angular.element("#plot-id-" + $scope.$id);
    	var child  = element.children();
    	var gd = child[0];
		return gd; 
    }

    $scope.resetAxes = function() {
    	var element = angular.element("#plot-id-" + $scope.$id);
    	var child  = element.children();
    	var gd = child[0];
		
 		var astr = {
 			xaxis : {
 				autorange: true
 			}, 
 			yaxis : {
 				autorange: true
 			}
 		}
    	Plotly.relayout(gd, astr);
    }

    $scope.autoscale = function() {
    	var aobj = {};
  		var gd = $scope.getGd();
  		var axList = [];
 		var layout = gd._fullLayout;
 		axList.push(layout.xaxis);
 		axList.push(layout.yaxis);

    	var ax;
    	for(var i = 0; i < axList.length; i++) {
    		ax = axList[i];
           	if(!ax.fixedrange) {
                axName = ax._name;
                aobj[axName + '.autorange'] = true;
            }
    	}
    	Plotly.relayout(gd, aobj);
    }

    $scope.getAxesNames = function(gd) {
    	var keys = lodash.keys(gd.layout);
    	var axes = lodash.filter(keys, function(n) {
			  return n.indexOf("axis") >= 0;
			});
			return axes;
    }

    $scope.updateAxis = function() {
    	 $scope.axis = $scope.axes[$scope.axisName[0]];
    }

    $scope.startsWith = function (actual, expected) {
	    var lowerStr = (actual + "").toLowerCase();
	    return lowerStr.indexOf(expected.toLowerCase()) === 0;
	  }

    $scope.openSettings = function() {
    	var gd = $scope.getGd();
    	var layout = $scope.layout;
    	$scope.layoutCopy = {};
    	$scope.axesNames = $scope.getAxesNames(gd);
    	
    	angular.copy(layout, $scope.layoutCopy);
			
			var axes = {};
    	angular.forEach($scope.axesNames, function(name) {
    		axes[name] = $scope.layoutCopy[name];
    	});
    	$scope.axes = axes;
    	$scope.axisName[0] = $scope.axesNames[0];
    	$scope.axis = $scope.axes[$scope.axisName[0]];

	    var modalInstance = $uibModal.open({
	      animation: true,
	      conttroller: 'PlotSettingsCtrl',
	      scope: $scope,
	      size: "lg",
	      templateUrl: 'templates/plot_options.html',
	    });

	    modalInstance.result.then(function (result) {
	    	console.log(result);
	      	console.log('Modal closed at: ' + new Date());
	      	$scope.layout = result;
	    }, function () {
	      console.log('Modal dismissed at: ' + new Date());
	    });
	}

}]);