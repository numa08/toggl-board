'use strict';

exports.showUserData = function(token, callback) {
  var factory = require('./toggl-factory');
  var toggleClient = factory.create({apiToken : token});
  toggleClient.getUserData({with_related_data : true},callback);
};