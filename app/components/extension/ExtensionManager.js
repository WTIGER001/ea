/*
Extension Manager
------------------------------------
The extension manager supports the dynamic addition of capablities to the system
without incuring a dependancy or requiring a recompile. This capablity is limited
to only bare javascript and a few utilities. 

Extensions are used to provide the rules that are used for coding, filtering and 
dynamically creating new columns

*/

// Keeps all the locals out of the global namespace
(function() {

	'use strict';

	/**
		Extension Manager
	*/
	function ExtensionManager($http, lodash) {

		var globalExtensions  = {};		// Represents all the extensions that are globally avaialable
		var userExtensions    = {};		// Extensions that this user has submitted
		var projectExtensions = {};		// Extensions that are in this project

		/**
			Add
		*/
		function add(extension) {
			var eid = extension.extensionPointId;
			var extensionCollection = globalExtensions[eid];
			if (angular.isUndefined(extensionCollection)) {
				extensionCollection = {};
				globalExtensions[eid] = extensionCollection;
			}

			extensionCollection[extension.id] = extension;
		}

		/**
			Remove
		*/
		function remove(extensionId, extensionUID) {
			var extensionCollection = globalExtensions[extensionId];
			if (!angular.isUndefined(extensionCollection)) {
				delete extensionCollection[extensionUID];
			}
		}

		/**
			getAll
		*/
		function getAll(extensionId) {
			var extensionCollection = globalExtensions[extensionId];
			if (angular.isUndefined(extensionCollection)) {
				return [];
			}
			return lodash.values(extensionCollection);
		}

		/**
			get
		*/
		function get(extensionUID, extensionId) {
			if (angular.isUndefined(extensionId)) {
				var keys = lodash.keys(globalExtensions);
				for (var i =0; i<keys.length; i++) {
					var collection = globalExtensions[keys[i]];
					var item = collection[extensionUID];
					if (angular.isUndefined(item) == false) {
						return item;
					}
				}
			} else {
				var extensionCollection = globalExtensions[extensionId];
				if (angular.isUndefined(extensionCollection)) {
					return null;
				}
				return extensionCollection[extensionUID];
			}
		}

		// exports
		var svc = {};
		svc.add = add;
		svc.remove = remove;
		svc.getAll = getAll;
		return svc;
	}

	angular.module('eaApp').factory('ExtensionManager', ['$http', 'lodash', ExtensionManager]); 

})();
