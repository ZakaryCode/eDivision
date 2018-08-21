const _fs_ = require("fs");
const _path_ = require("path");
const ipc = require('electron').ipcMain;
const _net = require('electron').net;
const dialog = require('electron').dialog;

const writeAudio = (p, d) => {
  const __dir = _path_.resolve("audio"),
    __path = _path_.resolve(__dir + "/" + p);
  _fs_.mkdir(__dir, {
    flag: "wx+"
  }, function (err) {
    if (err) {
      console.log(__dir, "路径存在");
    } else {
      console.log(__dir, "路径不存在");
    }
    _fs_
      .writeFile(__path, d, {
        flag: "w+"
      }, function (err) {
        if (err) {
          dialog.showErrorBox('错误', '文件操作发生错误.');
          console.log(__path, err);
        } else {
          console.log(__path, "写入成功");
        }
      });
  });
}

ipc.on('get-xfyun-radio', (event, AUE, url, headers, body) => {
  console.log(_net, url, headers, body);
  const req = _net.request({method: 'POST', url: url});
  for (const name in headers) {
    if (headers.hasOwnProperty(name)) {
      req.setHeader(name, headers[name]);
    }
  }
  req.end(body, "utf-8", () => {
    req.on('response', (res) => {
      console.log(`STATUS: ${res.statusCode}`)
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`, res.headers["content-type"] == 'audio/mpeg')
      let chunks = [],
        size = 0;
      res.on('data', (chunk) => {
        if (res.headers["content-type"] == "audio/mpeg") {
          chunks.push(chunk);
          size += chunk.length;
        } else {
          console.log(`BODY: ${chunk}`);
          chunk = JSON.parse(chunk);
          dialog.showErrorBox('错误', "sid=" + chunk.sid + ";desc=" + chunk.desc);
        }
      })
      res.on('end', () => {
        if (res.headers["content-type"] == "audio/mpeg") {
          var data = null;
          switch (chunks.length) {
            case 0:
              data = new Buffer(0);
              break;
            case 1:
              data = chunks[0];
              break;
            default:
              data = new Buffer(size);
              for (var i = 0, pos = 0, l = chunks.length; i < l; i++) {
                var chunk = chunks[i];
                chunk.copy(data, pos);
                pos += chunk.length;
              }
              break;
          }
          console.log(`BODY: ${data.toString()}`);
          let sid = res.headers['sid']
          if (AUE === "raw") {
            const __path = sid + ".wav";
            writeAudio(__path, data);
          } else {
            const __path = sid + ".mp3";
            writeAudio(__path, data);
          }
          console.log("success, sid = " + sid);
        } else {
          console.log('\nresponse请求中没有更多数据。')
        }
      })
      res.on('error', (error) => {
        console.log(`ERROR: ${error}`);
      })
    });
    req.on('login', (authInfo, callback) => {
      callback()
    });
  });
});
