'use strict';
const TogglClient = require('toggl-api');
const moment = require('moment');
const Remote = require('electron').remote;
const async = require('async');
const fs = Remote.require('fs');
const dialog = Remote.require('dialog');

require('moment-duration-format');

const TOKEN_KEY = 'net.numa08.toggl-board';

var apiTokens = function() {
    var savedTokens;
    if (localStorage.getItem(TOKEN_KEY) === null) {
        savedTokens = [];
    } else {
        savedTokens = JSON.parse(localStorage.getItem(TOKEN_KEY));
    }
    return savedTokens;
};

var addApiToken = function(token) {
    var savedTokens = apiTokens();
    savedTokens.push(token);
    localStorage.setItem(TOKEN_KEY, JSON.stringify(savedTokens));
};

var togglBoard = angular.module('TogglBoard', ['ngDialog']);
togglBoard.controller('TogglController', function($scope, $interval, ngDialog) {

    $scope.userDataContainer = {
        users: []
    };

    $scope.bulkStopAll = function() {

        async.eachSeries($scope.userDataContainer.users,
         function(user, callback) {

             if (user.doing_now === false) {
                 return callback(null, user);
             }

             var id = user.current_time_entry.id;
             var apiToken = user.api_token;
             var client = new TogglClient({apiToken: apiToken});
             client.stopTimeEntry(id, function(err) {
                if (err) {
                    return callback(err, null);
                }

                client.getUserData({with_related_data: true},
                function(err, userData) {
                    updateUserDataContainer(userData);
                    callback(err, user);
                });
            });
         }, function(err) {
            if (err) {
                console.error(err);
            }
        });
    };

    $scope.bulkStartAll = function() {
        var taskname = $scope.taskName;
        if (taskname && taskname.length > 0) {

            async.eachSeries($scope.userDataContainer.users,
            function(user, callback) {

                var apiToken = user.api_token;
                var client = new TogglClient({apiToken: apiToken});
                client.startTimeEntry({'description': taskname}, function(err) {
                    if (err) {
                        return callback(err, null);
                    }
                    client.getUserData({with_related_data: true},
                    function(err, userData) {
                        updateUserDataContainer(userData);
                        callback(err, user);
                    });
                });

            }, function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
    };

    $scope.openAddUserPrompt = function() {
        ngDialog.openConfirm({
            template: 'template-add-user',
            closeByDocument: true,
            closeByEscape: true
        }).then(function(apiToken) {
            $scope.addUser(apiToken);
        });
    };

    $scope.addUser = function(apiToken) {
        new TogglClient({apiToken: apiToken})
      .getUserData({with_related_data: true}, function(err, userData) {
          if (err) {
              console.error(err);
              return;
          }

          addApiToken(userData.api_token);
          appendUserDataContainer(userData);
      });
    };
    
    $scope.exportFile = function() {
        dialog.showSaveDialog({title: 'Export JSON', defaultPath: 'tokens.json'}, 
        function(path) {
            var json = localStorage.getItem(TOKEN_KEY);
            fs.writeFile(path, json, function(err) {
                if(err) {
                    console.error(err);
                }
            });
        });
    };
    
    $scope.importFile = function() {
        dialog.showOpenDialog({});
    };

    (function() {

        var saveScreenShot = function() {
            // Screenshot を取って保存する
            Remote.getCurrentWindow().capturePage(function(img) {
                if (img.isEmpty()) {
                    return;
                }
                fs.writeFile('/tmp/toggle-board-ss.png', img.toPng(),
                function(err) {
                    if (err) {
                        console.error(err);
                    }
                });
            });
        };

        async.eachSeries(apiTokens(), function(apiToken, callback) {
            new TogglClient({apiToken: apiToken})
      .getUserData({with_related_data: true}, function(err, userData) {
          appendUserDataContainer(userData);
          callback(err, userData);
      });
        }, function(err) {
            if (err) {
                console.error(err);
            }
            saveScreenShot();
        });

        $interval(function() {
            async.eachSeries(apiTokens(), function(apiToken, callback) {
                new TogglClient({apiToken: apiToken})
        .getUserData({with_related_data: true}, function(err, userData) {
            if (err) {
                callback(err);
                return;
            }
            updateUserDataContainer(userData);
            callback(null, userData);
        });
            }, function(err) {
                if (err) {
                    console.error(err);
                }
                saveScreenShot();
            });

        }, 10 * 1000);

        $interval(function() {
            $scope.userDataContainer
            .users
            .filter(function(u) {return u.doing_now;})
      .forEach(function(u) {
          var range = Date.range(Date.parse(u.current_time_entry.start));
          u.current_time_entry.duration_output =  moment
          .duration(range, 'ms')
          .format('h [hrs], m [min], s [sec]');
      });
        }, 1000);
    })();

    var appendUserDataContainer = function(userData) {
        userData.current_time_entry = buildCurrentTimeEntry(userData);
        userData.doing_now = userData.current_time_entry !== null;
        $scope.$apply(function() {
            $scope.userDataContainer.users.push(userData);
        });
    };

    var updateUserDataContainer = function(userData) {
        var index = $scope.userDataContainer.users.findIndex(function(u) {
            return u.fullname === userData.fullname;
        });
        if (index < 0) {
            return;
        }
        userData.current_time_entry = buildCurrentTimeEntry(userData);
        userData.doing_now = userData.current_time_entry !== null;
        $scope.userDataContainer.users[index] = userData;
    };

    var buildCurrentTimeEntry = function(userData) {
        var lastTimeEntry = userData
        .time_entries[userData.time_entries.length - 1];
        var currentTimeEntry = null;
        if (lastTimeEntry.duration < 0) {
            currentTimeEntry = lastTimeEntry;
            var range = Date.range(Date.parse(currentTimeEntry.start));
            currentTimeEntry.duration_output = moment
            .duration(range, 'ms')
            .format('h [hrs], m [min], s [sec]');
        }
        return currentTimeEntry;
    };
});

Date.prototype.range = function(d) {
    return new Date().getTime() - d;
};
