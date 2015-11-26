'use strict';
var TogglClient = require('toggl-api');

var togglBoard = angular.module('TogglBoard', []);
togglBoard.controller('TogglController', ['$scope', function($scope) {
	
	$scope.userDataContainer = {
		users: []
	};
	
	$scope.addUser = function() {
		 new TogglClient({apiToken: $scope.apiToken})
		 .getUserData({with_related_data: true}, function(err, userData) {
			if(err){
				console.error(err);
				return;	
			}
			localStorage.setItem(userData.fullname, userData.api_token);
			
			appendUserDataContainer(userData);			
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

				appendUserDataContainer(userData);
				setInterval(function() {
					for(var i = 0; i < localStorage.length; i++) {
						var key = localStorage.key(i);
						var apiToken = localStorage.getItem(key);
						new TogglClient({apiToken: apiToken})
						.getUserData({with_related_data: true}, function(err, userData) {
							if(err) {
								console.error(err);
								return;
							}
							updateUserDataContainer(userData);
						})
					}
				}, 1000);		
			});
		}
	})();

	var appendUserDataContainer = function(userData) {
			var lastTimeEntry = userData.time_entries[userData.time_entries.length - 1];
			var currentTimeEntry = null;
			if(lastTimeEntry.duration < 0) {
				currentTimeEntry = lastTimeEntry;
				currentTimeEntry.spent = new Date().getTime() - Date.parse(currentTimeEntry.start);
				currentTimeEntry.spent_sec = Math.ceil(currentTimeEntry.spent / 1000);
			}
			userData.current_time_entry = currentTimeEntry;
			userData.doing_now = currentTimeEntry != null;	
			$scope.$apply(function() {
				$scope.userDataContainer.users.push(userData);
				$scope.userDataContainer[userData.fullname] = $scope.userDataContainer.users.length - 1;			
			});
	};
	
	var updateUserDataContainer = function(userData) {
			var index = $scope.userDataContainer[userData.fullname];
			if(index > $scope.userDataContainer.users.length) {
				return;
			}
			var lastTimeEntry = userData.time_entries[userData.time_entries.length - 1];
			var currentTimeEntry = null;
			if(lastTimeEntry.duration < 0) {
				currentTimeEntry = lastTimeEntry;
				currentTimeEntry.spent = new Date().getTime() - Date.parse(currentTimeEntry.start);
				currentTimeEntry.spent_sec = Math.ceil(currentTimeEntry.spent / 1000);
			}
			userData.current_time_entry = currentTimeEntry;
			userData.doing_now = currentTimeEntry != null;	
			$scope.$apply(function() {
				$scope.userDataContainer.users[index] = userData;
			});
	};

}]);