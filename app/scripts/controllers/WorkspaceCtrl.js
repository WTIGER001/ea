var app = angular.module('eaApp');
 
app.controller('WorkspaceCtrl', ['$scope', 'ProjectService', 'SessionService', 'trace', 'lodash', '$rootScope',
	function ($scope, ProjectService, SessionService, trace, lodash, $rootScope) {
        $scope.data = [];
        $scope.traces = [];     
        $scope.layout = {height: 600, width: 1000, title: 'foobar'};
        $scope.options = {showlink: false, displaylogo: false, displayModeBar: true, scrollZoom: true};

        $scope.uploadFiles = function (files) {
         	$scope.files = files;
            if (files && files.length) {
            	SessionService.loadCsv(files);
            }
         }

        // $scope.refresh = function () {
        //     console.log( "Refreshing Plot " );
        //     $scope.data = trace.makeTraces();          
        //     $scope.traces = $scope.data;
        //     console.log( $scope.data.length  + " Traces Now");

        //     var columns = [];
        //     angular.forEach($scope.datasets, function(dataset) {
        //         columns = lodash.union(columns, dataset.fields);
        //     })
        //     $scope.columns = columns;
        // }

        // $rootScope.$watchCollection('datasets', function() {
        //      console.log( "Plot data has changed" );
        //     $scope.refresh();
        // })

        // $rootScope.$watch('watchMe', function() {
        //     console.log( "Plot data has changed" );
        //     $scope.refresh();
        // })

        $scope.closePortlet = function($event) {
            var t = $event.target;
            var t2 = event.currentTarget;
            var p1 = angular.element($event.target).parent().parent().parent();
            p1.remove();
        }

        $scope.addPlot= function($document) {
            //var element = angular.element('#portlet-area');
          
        }

}])
