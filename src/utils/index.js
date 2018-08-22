const Duplex = require('stream').Duplex;

export const getPath = () => {}

export const json2Form = (json) => {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

export const toArrayBuffer = (buf) => {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

export const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}

export const bufferToStream = (buffer) => {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}