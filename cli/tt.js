'use strict';

var package_json = require('./package.json');
var options = require('node-getopt').create([
  ['i' , 'identifier=' , 'Your API Token for Toggl. You can get your token in https://toggl.com/app/profile'],
  ['h', 'help', 'display the help']
])              
.bindHelp()     
.parseSystem();

var token = options.options.identifier;
if(!token) {
  console.error("Please set your API TOKEN!!");
  console.error("You can get your toggl's API TOKEN at https://toggl.com/app/profile");
  process.exit(1);
}

var showUserData = function(token, callback) {
  var factory = require('./toggl-factory');
  var toggleClient = factory.create({apiToken : token});
  toggleClient.getUserData({with_related_data : true},callback);
};

showUserData(token, function (err, userData) {
  if(err) {
    console.error(err);
    process.exit(1);
    return;
  }
  console.info(userData);
});