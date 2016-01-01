
angular
.module('eaApp')
.controller('homeCtrl', ['$scope', 'ProjectService', function ($scope, ProjectService) {
	$scope.name = "TEST";

	$scope.name = ProjectService.name;
	$scope.data = ProjectService.data;
}]);
