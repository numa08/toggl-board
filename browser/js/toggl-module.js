'use strict';
var TogglClient = require('toggl-api');

var togglBoard = angular.module('TogglBoard', []);
togglBoard.controller('TogglController', ['$scope', function($scope) {
	
	$scope.userDataCollection = [];
	
	$scope.addUser = function() {
		 new TogglClient({apiToken: $scope.apiToken})
		 .getUserData({with_related_data: true}, function(err, userData) {
			if(err){
				console.error(err);
				return;	
			}
			localStorage.setItem(userData.fullname, userData.api_token);
			
			appendUserDataCollection(userData);			
		 });
	};
	
	(function(){
		for(var i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i);
			var apiToken = localStorage.getItem(key);
			new TogglClient({apiToken: apiToken})
			.getUserData({with_related_data: true}, function(err, userData) {
				if(err) {
					console.error(err);
					return;
				}

				appendUserDataCollection(userData);				
			});
		}
	})();

	var appendUserDataCollection = function(userData) {
					var lastTimeEntry = userData.time_entries[userData.time_entries.length - 1];
			var currentTimeEntry = null;
			if(lastTimeEntry.duration < 0) {
				currentTimeEntry = lastTimeEntry;
			}
			userData.current_time_entry = currentTimeEntry;
			userData.doing_now = currentTimeEntry != null;	
			$scope.$apply(function() {
				$scope.userDataCollection.push(userData);				
			});
	};
}]);