'use strict';
var TogglClient = require('toggl-api');

var togglBoard = angular.module('TogglBoard', []);
togglBoard.controller('TogglController', ['$scope', function($scope) {
	
	$scope.userDataCollection = [];
	
	$scope.addUser = function() {
		 new TogglClient({apiToken: $scope.apiToken})
		 .getUserData({with_related_data: true}, function(err, userData) {
			if(err) console.error(err);
			var lastTimeEntry = userData.time_entries[userData.time_entries.length - 1];
			var currentTimeEntry = null;
			if(lastTimeEntry.duration < 0) {
				currentTimeEntry = lastTimeEntry;
			}
			userData.current_time_entry = currentTimeEntry;			
			$scope.$apply(function() {
				$scope.userDataCollection.push(userData);				
			});
		 });
	}
}]);