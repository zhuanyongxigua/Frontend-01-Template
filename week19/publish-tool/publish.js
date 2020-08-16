const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
const archiver = require('archiver');

let packname = './package';

// fs.stat(filename, (error, stat) => {
  const options = {
    host: 'localhost',
    port: 3000,
    path: '/wtf?filename=' + 'package.zip',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  var archive = archiver('zip', {
    zlib: { level: 9 }
  })
  archive.directory(packname, false);
  archive.finalize();
  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  });
  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  })
  archive.pipe(req);
  archive.on('end', () => {
    req.end();
  })
  // let readStream = fs.createReadStream('./cat.jpg');
  // readStream.pipe(req);
  // readStream.on('end', () => {
  //   req.end();
  // })
// })
