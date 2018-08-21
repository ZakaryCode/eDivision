const {ipcMain} = require('electron')

ipcMain.on('ondragstart', (event, filePath) => {
  console.log("拖放文件", filePath);
});