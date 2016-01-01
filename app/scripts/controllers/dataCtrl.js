var app = angular.module('eaApp');
 
app.controller('DataCtrl', ['$scope', 'lodash', '$rootScope', function ($scope, lodash, $rootScope) {
    
}]);

app.controller('DataSetTableCtrl', ['$scope', 'lodash', '$rootScope', function ($scope, lodash, $rootScope) {
    
    var dataset = $scope.dataset;

    console.log("Computing Table Options");
    var columnDefinitions =  [];
    for (var i = 0; i<dataset.fields.length; i++) {
        columnDefinitions.push({ name : dataset.fields[i], field : ""+i});
    }


    var dt = [{ test : "hi"}];
    var options = {
        enableFiltering: false,
        enableColumnResizing: true,
        columnDefs: columnDefinitions,
        data : dataset.rows,
        // onRegisterApi: function( gridApi ) {
        //   $scope.gridApi = gridApi;
        // }
    }
    $scope.options = options;
}]);