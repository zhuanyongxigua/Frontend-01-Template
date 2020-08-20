const http = require('http');
const fs = require('fs');
const unzip = require('unzipper');

const server = http.createServer((req, res) => {
  let writeStream = unzip.Extract({path: '../server/public'});
  // req.pipe(writeStream);
  // 如果不用pipe，也可以这样写
  req.on('data', trunk => {
    writeStream.write(trunk);
  });
  req.on('end', trunk => {
    writeStream.end(trunk);
  })
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
  })
})

server.listen(3000);