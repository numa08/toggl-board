'use strict';
const TogglClient = require('toggl-api');
const moment = require('moment');

require('moment-duration-format');

var togglBoard = angular.module('TogglBoard', ['ngDialog']);
togglBoard.controller('TogglController', function($scope, ngDialog) {
	
	$scope.userDataContainer = {
		users: []
	};

	$scope.openAddUserPrompt = function() {
        ngDialog.openConfirm({ 
        	template: 'template-add-user',
        	closeByDocument: true,
        	closeByEscape: true
        }).then(function (apiToken) {
        	$scope.addUser(apiToken);
        });
	}

	$scope.addUser = function(apiToken) {
		 new TogglClient({apiToken: apiToken})
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
				}, 10 * 1000);		
			});
		}
	})();

	var appendUserDataContainer = function(userData) {
			var lastTimeEntry = userData.time_entries[userData.time_entries.length - 1];
			var currentTimeEntry = null;
			if(lastTimeEntry.duration < 0) {
				currentTimeEntry = lastTimeEntry;
				var range = new Date().getTime() - Date.parse(currentTimeEntry.start);
				currentTimeEntry.duration_output = moment.duration(range, "ms").format("h [hrs], m [min], s [sec]");
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
				var range = new Date().getTime() - Date.parse(currentTimeEntry.start);
				currentTimeEntry.duration_output = moment.duration(range, "ms").format("h [hrs], m [min], s [sec]");
			}
			userData.current_time_entry = currentTimeEntry;
			userData.doing_now = currentTimeEntry != null;	
			$scope.$apply(function() {
				$scope.userDataContainer.users[index] = userData;
			});
	};

});