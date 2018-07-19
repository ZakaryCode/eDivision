const path = require('path');
const url = require('url');
const glob = require('glob');
const electron = require('electron');
// const autoUpdater = require('./auto-updater');
const __package = require("./package.json");

const {app, BrowserWindow} = electron;

const debug = /--debug/.test(process.argv[2]);

if (process.mas) 
  app.setName('Electron APIs');

var mainWindow = null;

function initialize() {
  var shouldQuit = makeSingleInstance();
  if (shouldQuit) 
    return app.quit();
  
  loadDemos();

  function createWindow() {
    var windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName()
    }

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png');
    }

    mainWindow = new BrowserWindow(windowOptions)
    if (__package.DEV) {
      mainWindow.loadURL("http://localhost:3000/");
    } else {
      mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './build/index.html'),
        protocol: 'file:',
        slashes: true
      }));
    }

    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow
        .webContents
        .openDevTools();
      mainWindow.maximize();
      require('devtron').install();
    }

    mainWindow
      .webContents
      .on('crashed', function () {
        const options = {
          type: 'info',
          title: '渲染器进程崩溃',
          message: '这个进程已经崩溃.',
          buttons: ['重载', '关闭']
        };
        electron
          .dialog
          .showMessageBox(options, function (index) {
            if (index === 0) {
              mainWindow.reload();
            } else {
              mainWindow.close();
            }
          });
      });
    mainWindow.on('closed', function () {
      mainWindow = null;
    });
  }

  app
    .on('ready', function () {
      createWindow();
      // autoUpdater.initialize();
    });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow();
    }
  });
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
  if (process.mas) {
    return false;
  }

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) 
        mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Require each JS file in the main-process dir
function loadDemos() {
  var files = glob.sync(path.join(__dirname, 'main-process/*.js'))
  files.forEach(function (file) {
    require(file);
  });
  // autoUpdater.updateMenu()
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    // autoUpdater.createShortcut(function () { app.quit() })
    break;
  case '--squirrel-uninstall':
    // autoUpdater.removeShortcut(function () { app.quit() })
    break;
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit();
    break;
  default:
    initialize();
}
