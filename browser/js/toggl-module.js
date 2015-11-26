'use strict';
var TogglClient = require('toggl-api');

var togglBoard = angular.module('TogglBoard', []);
togglBoard.controller('TogglController', ['$scope', function($scope) {
	
	$scope.addUser = function() {
		 new TogglClient({apiToken: $scope.apiToken})
		 .getUserData({}, function(err, userData) {
			if(err) console.error(err);
			$scope.$apply(function() {
				$scope.userName = userData.fullname;				
			});
		 });
	}
}]);