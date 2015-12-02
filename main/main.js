var app = require('app');
var Menu = require('menu');
var BrowserWindow = require('browser-window');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
	if(process.platrom != 'darwin') {
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
      },
    ]
  	}];

  	var menu = Menu.buildFromTemplate(template);
  	Menu.setApplicationMenu(menu);
});