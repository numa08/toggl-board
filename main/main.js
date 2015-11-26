var app = require('app');
var BrowserWindow = require('browser-window');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
	if(process.platrom != 'darwin') {
		app.quit();
	}
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 800, height: 600});
	mainWindow.loadURL('file://' + __dirname + '/../browser/index.html');
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});