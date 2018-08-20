const ipc = require('electron').ipcMain;
const _net = require('electron').net;
const dialog = require('electron').dialog;

ipc.on('get-xfyun-radio', (event, url, headers, body) => {
  console.log(_net, url, headers, body);
  const req = _net.request({method: 'POST', url: url});
  for (const name in headers) {
    if (headers.hasOwnProperty(name)) {
      req.setHeader(name, headers[name]);
    }
  }
  req.end(JSON.stringify(body), "utf-8", () => {
    req.on('response', (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          const element = res[key];
          console.log(`${key.toLocaleUpperCase()}: ${ (typeof element === "object"
            ? toString(element)
            : element)}`);
        }
      }
      res.on('error', (error) => {
        console.log(`ERROR: ${error}`);
      })
    });
    req.on('login', (authInfo, callback) => {
      callback()
    });
  });
});
