const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
const archiver = require('archiver');
const child_process = require('child_process');

let packname = './package';

let redirect_uri = encodeURIComponent("http://localhost:3000/auth");
child_process.exec(`open https://github.com/login/oauth/authorize?client_id=Iv1.75519f7644e273e5&redirect_uri=${redirect_uri}&scope=read%3Auser&state=123abc`);
const server = http.createServer((request, res) => {
  let token = request.url.match(/token=([^&]+)/)[1];
  const options = {
    host: 'localhost',
    port: 3000,
    path: '/wtf?filename=' + 'package.zip',
    method: 'POST',
    headers: {
      'token': token,
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
    console.log('publish success!');
    res.end("publish success!");
    server.close();
  })
})

server.listen(8080);

// fs.stat(filename, (error, stat) => {
  // let readStream = fs.createReadStream('./cat.jpg');
  // readStream.pipe(req);
  // readStream.on('end', () => {
  //   req.end();
  // })
// })
