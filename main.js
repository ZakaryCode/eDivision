const path = require('path'),
  url = require('url'),
  glob = require('glob'),
  electron = require('electron'),
  __conf = require("./src/conf/index");
// const autoUpdater = require('./auto-updater');

const {app, BrowserWindow} = electron;
const {mainWindowOptions} = __conf;

const debug = /--debug/.test(process.argv[2]);

if (process.mas) 
  app.setName('Electron APIs');

let mainWindow = null;

const initialize = () => {
  let shouldQuit = makeSingleInstance();
  if (shouldQuit) 
    return app.quit();
  
  loadDemos();

  const createWindow = () => {
    let windowOptions = {
      title: app.getName(),
      ...mainWindowOptions
    }

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png');
    }

    mainWindow = new BrowserWindow(windowOptions);
    // mainWindow.maximize();
    if (__conf.DEV) {
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
      .on('crashed', () => {
        const options = {
          type: 'info',
          title: '渲染器进程崩溃',
          message: '这个进程已经崩溃.',
          buttons: ['重载', '关闭']
        };
        electron
          .dialog
          .showMessageBox(options, (index) => {
            if (index === 0) {
              mainWindow.reload();
            } else {
              mainWindow.close();
            }
          });
      });
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

  app.on('ready', () => {
    createWindow();
    // autoUpdater.initialize();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
}

// Make this app a single instance app. The main window will be restored and
// focused instead of a second window opened when a person attempts to launch a
// second instance. Returns true if the current version of the app should quit
// instead of launching.
const makeSingleInstance = () => {
  if (process.mas) {
    return false;
  }

  return app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) 
        mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Require each JS file in the main-process dir
const loadDemos = () => {
  var files = glob.sync(path.join(__dirname, 'main-process/*.js'))
  files.forEach((file) => {
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
