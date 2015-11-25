var TogglClient = require('toggl-api');

exports.create = function(options) {
	return new TogglClient(options);	
};