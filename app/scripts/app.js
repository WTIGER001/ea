'use strict';

/**
 * @ngdoc Main Application module for Event Analysis
 * @name Event Analysis
 * @description
 * # angularTestApp
 *
 * Main module of the application.
 */
angular
  .module('eaApp', [
    'ngAnimate',
    'ngTouch',
    'ui.bootstrap', 
    'ui.router', 
    'ui.grid',
    'ui.grid.grouping', 
    'ui.grid.autoResize',
    'ngLodash', 
    'plotly', 
    'ngFileUpload', 
    'ngPapaParse', 
    'angularSpectrumColorpicker', 
    'frapontillo.bootstrap-switch', 
    'uiSwitch'
  ])
  .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");
    
    $stateProvider
      .state('home', {
        url : '/',
        templateUrl : 'templates/home.html', 
        controller : 'homeCtrl'
      })
      .state('data', {
        url : '/data', 
        templateUrl : 'templates/data.html',
        controller : 'DataCtrl'
      })
      .state('workspace', {
        url : '/workspace', 
        templateUrl : 'templates/workspace.html', 
        controller: 'WorkspaceCtrl'
      })
  }]);
