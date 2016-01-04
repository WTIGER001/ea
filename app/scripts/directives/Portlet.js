/*
Portlet Directives
--------------------------------------------
*/
'use strict';

var app = angular.module('eaApp')

app.directive('closePortlet', [function () {
  	return {
  		link: function (scope, element, iAttrs) {
  			element.bind("click", function(){
  				element.parent().parent().parent().remove();
			});
  		}
  	};
}]);

 		
//Directive for adding buttons on click that show an alert on click
app.directive("addPortlet", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	            var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
	            return v.toString(16);
	        });

			angular.element(document.getElementById('portlet-area')).append($compile("<div plot-portlet uuid="+ uuid +">TEST</div>")(scope));
		});
	};
});


app.directive('plotPortlet', [function () {
  	return {
  		restrict: 'A',
  		scope : false,
  		templateUrl: "components/plotting/plot.html",
  		link: function (scope, element, attrs) {
  			//element.parent().parent().parent().remove();
  			scope.uuid = attrs['uuid'];
  		}
  	};
 }]);
