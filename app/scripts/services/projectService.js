'use strict';

angular
  .module('eaApp')
  .service('ProjectService', ['$http', 'lodash', function ($http, lodash) {
  	this.name = "New Project";
  	this.descrition = "";
    var that = this;

    $http
      .get('data/data_3.json')
      .then(function(response) {
        that.data = response.data;
      });

      this.getAllTargets = function() {
        var targets = [];
        lodash.forEach(that.data.targets, function(tgtIndex, tgtKey, allTargets) {
          targets.push(this);
        });
      }

    this.getDataTable = function(object) {
      var columns = lodash.keys(object.repReturns);

      // Count the max number of values
      var cnt = object.repReturns[columns[0]].values.length;

      var dataTable = [];
      for (var i = 0; i<cnt; i++) {
        var obj = {};

        // time, etc.
        lodash.forEach(columns, function(n, k, all) {
          obj[n] = object.repReturns[n].values[i];
        });

        dataTable.push(obj);
      }

      return dataTable;
    }


    this.getAllTargetData = function() {
        var alldata = [];

        lodash.forEach(that.data.targets, function(tgt) {  
          var tgtName = tgt.name;

          lodash.forEach(tgt.objects, function(object) {
            var dt = that.getDataTable(object);

            lodash.forEach(dt, function(item) {
              item.target = tgtName;
              item.objectId = object.name;
              item.objectType = object.type;
              alldata.push(item);
            });
          });
        });
        return alldata;
    }

    this.getRepReturnColumns = function() {
      var allcols = [];

        lodash.forEach(that.data.targets, function(tgt) {  
          lodash.forEach(tgt.objects, function(object) {
             var columns = lodash.keys(object.repReturns);
             allcols = lodash.union(allcols, columns);
          });
        });
        return allcols;
    }
  }])

