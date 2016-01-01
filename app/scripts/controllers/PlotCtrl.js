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

	 	$scope.palette = [
        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
    ];


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


    $scope.openSettings = function() {
    	var gd = $scope.getGd();
    	var layout = $scope.layout;
    	$scope.layoutCopy = {};
    	$scope.axesNames = $scope.getAxesNames(gd);
    	
    	angular.copy(layout, $scope.layoutCopy);
			
			var axes = {};
    	angular.forEach($scope.axesNames, function(name) {
    		axes[name] = $scope.layoutCopy[name];
    		$scope.axis = $scope.layoutCopy[name];
    	});
    	$scope.axes = axes;

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