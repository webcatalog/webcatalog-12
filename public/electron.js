const { app, BrowserWindow } = require('electron');
const argv = require('yargs-parser')(process.argv.slice(1));
const isDev = require('electron-is-dev');
const path = require('path');

const isTesting = argv.testing === 'true'; // Spectron mode

const createMenu = require('./libs/create-menu');
const loadListeners = require('./listeners');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isSecondInstance = app.makeSingleInstance(() => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (isSecondInstance) {
  app.exit();
}

// load ipcMain listeners
loadListeners();

const createWindow = () => {
  const defaultHeight = 550;
  const defaultWidth = 400;

  const options = {
    width: defaultWidth,
    height: defaultHeight,
    minWidth: defaultWidth,
    minHeight: defaultHeight,
    maxWidth: defaultWidth,
    maxHeight: defaultHeight,
    title: 'Appifier',
    titleBarStyle: 'default',
    autoHideMenuBar: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: isTesting, // only needed for testing
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  };

  // create window
  mainWindow = new BrowserWindow(options);

  // load menu
  createMenu();

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.resolve(__dirname, 'index.html')}`);

  // Emitted when the close button is clicked.
  mainWindow.on('close', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow) {
    mainWindow.show();
  } else {
    createWindow();
  }
});
