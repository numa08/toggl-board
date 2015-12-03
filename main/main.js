var app = require('app');
var Menu = require('menu');
var BrowserWindow = require('browser-window');
var express = require('express');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platrom != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({width: 1000, height: 600});
    mainWindow.loadURL('file://' + __dirname + '/../browser/index.html');
    // mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    var template = [
    {
        label: 'Edit',
        submenu: [
        {
            label: 'Cut',
            accelerator: 'Command+X',
            selector: 'cut:'
        },
        {
            label: 'Copy',
            accelerator: 'Command+C',
            selector: 'copy:'
        },
        {
            label: 'Paste',
            accelerator: 'Command+V',
            selector: 'paste:'
        },
        {
            label: 'Select All',
            accelerator: 'Command+A',
            selector: 'selectAll:'
        }
      ]
    }];

    var menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    var server = express();

    // Screenshot を配信
    server.get('/ss', function(req, res) {

        var options = {
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        const filename = '/tmp/toggle-board-ss.png';
        res.sendFile(filename, options, function(err) {
            if (err) {
                console.error(err);
                res.status(err.status).end();
            }
        });
    });

    const port = process.env.PORT || 9000;
    server.listen(port);
    console.log('Start server: PORT = ' + port);
});

