const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

ipc.on('open-file-dialog', function (event) {
  dialog
    .showOpenDialog({
      properties: ['openFile'],
      filters: [
        {
          name: 'TXT文件',
          extensions: ['txt']
        }
      ]
    }, function (files) {
      if (files) 
        event.sender.send('selected-file', files);
      }
    );
});

ipc.on('open-file-multiSelections-dialog', function (event) {
  dialog
    .showOpenDialog({
      properties: [
        'openFile', 'multiSelections'
      ],
      filters: [
        {
          name: 'TXT文件',
          extensions: ['txt']
        }
      ]
    }, function (files) {
      if (files) 
        event.sender.send('selected-file', files);
      }
    );
});

ipc.on('open-directory-dialog', function (event) {
  dialog
    .showOpenDialog({
      properties: ['openDirectory']
    }, function (files) {
      if (files) 
        event.sender.send('selected-directory', files);
      }
    );
});

ipc.on('open-error-get-file-dialog', function (event) {
  dialog.showErrorBox('错误', '文件操作发生错误.');
});